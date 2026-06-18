#!/usr/bin/env python3
"""Capture screenshots and extract visual/SEO diagnostics for guoen.dev."""

import json
import sys
from playwright.sync_api import sync_playwright

URL = "https://guoen.dev/"
OUT_DIR = "/Users/alex/Documents/tailwind-nextjs-starter-blog/screenshots"

VIEWPORTS = {
    "desktop": {"width": 1920, "height": 1080},
    "mobile": {"width": 375, "height": 812},
}

def run():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()

        for name, vp in VIEWPORTS.items():
            is_mobile = name == "mobile"
            ctx = browser.new_context(
                viewport=vp,
                device_scale_factor=2 if is_mobile else 1,
                is_mobile=is_mobile,
                user_agent=(
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
                    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
                ) if is_mobile else None,
            )
            page = ctx.new_page()

            # Collect CLS events
            cls_score = 0.0
            page.evaluate("""() => {
                window._cls = 0;
                new PerformanceObserver((list) => {
                    for (const e of list.getEntries()) {
                        if (!e.hadRecentInput) window._cls += e.value;
                    }
                }).observe({type: 'layout-shift', buffered: true});
            }""")

            page.goto(URL, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(2000)  # let fonts / LCP settle

            cls_score = page.evaluate("() => window._cls || 0")

            # Screenshot
            path = f"{OUT_DIR}/{name}.png"
            page.screenshot(path=path, full_page=False)  # above-the-fold only
            print(f"[{name}] screenshot saved → {path}")

            # --- diagnostics ---
            diag = {}

            # Viewport meta
            diag["viewport_meta"] = page.evaluate("""() => {
                const m = document.querySelector('meta[name=viewport]');
                return m ? m.getAttribute('content') : null;
            }""")

            # H1
            diag["h1_text"] = page.evaluate("""() => {
                const h = document.querySelector('h1');
                return h ? h.innerText.trim() : null;
            }""")

            # Primary CTA above fold
            diag["cta_above_fold"] = page.evaluate(f"""() => {{
                const foldY = {vp['height']};
                const candidates = [...document.querySelectorAll('a[href], button')];
                const visible = candidates.filter(el => {{
                    const r = el.getBoundingClientRect();
                    return r.top < foldY && r.bottom > 0 && r.width > 0;
                }});
                return visible.slice(0,5).map(el => ({{
                    tag: el.tagName,
                    text: el.innerText.trim().slice(0,60),
                    href: el.getAttribute('href'),
                    top: Math.round(el.getBoundingClientRect().top),
                    width: Math.round(el.getBoundingClientRect().width),
                    height: Math.round(el.getBoundingClientRect().height),
                }}));
            }}""")

            # Tap targets (mobile only) — find links/buttons < 48px in either dimension
            if is_mobile:
                diag["small_tap_targets"] = page.evaluate("""() => {
                    const els = [...document.querySelectorAll('a, button')];
                    return els
                        .filter(el => {
                            const r = el.getBoundingClientRect();
                            return r.width > 0 && r.height > 0 && (r.width < 48 || r.height < 48);
                        })
                        .slice(0, 20)
                        .map(el => ({
                            tag: el.tagName,
                            text: el.innerText.trim().slice(0, 40),
                            w: Math.round(el.getBoundingClientRect().width),
                            h: Math.round(el.getBoundingClientRect().height),
                        }));
                }""")

            # Horizontal scroll
            diag["has_horizontal_scroll"] = page.evaluate("""() =>
                document.documentElement.scrollWidth > document.documentElement.clientWidth
            """)

            # Base font size
            diag["body_font_size_px"] = page.evaluate("""() => {
                const s = window.getComputedStyle(document.body);
                return s.fontSize;
            }""")

            # Nav visible
            diag["nav_visible"] = page.evaluate("""() => {
                const nav = document.querySelector('nav, header');
                if (!nav) return false;
                const r = nav.getBoundingClientRect();
                return r.height > 0;
            }""")

            # Hero image
            diag["hero_image"] = page.evaluate("""() => {
                const imgs = [...document.querySelectorAll('img')].filter(i => {
                    const r = i.getBoundingClientRect();
                    return r.top < window.innerHeight && r.width > 200;
                });
                return imgs.map(i => ({src: i.src.slice(0,80), w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), loading: i.loading}));
            }""")

            # SEO meta
            diag["meta_title"] = page.title()
            diag["meta_description"] = page.evaluate("""() => {
                const m = document.querySelector('meta[name=description]');
                return m ? m.getAttribute('content') : null;
            }""")
            diag["og_image"] = page.evaluate("""() => {
                const m = document.querySelector('meta[property="og:image"]');
                return m ? m.getAttribute('content') : null;
            }""")
            diag["canonical"] = page.evaluate("""() => {
                const l = document.querySelector('link[rel=canonical]');
                return l ? l.getAttribute('href') : null;
            }""")

            diag["cls_score"] = round(cls_score, 4)

            results[name] = diag
            ctx.close()

        browser.close()

    print("\n=== DIAGNOSTICS ===")
    print(json.dumps(results, indent=2, ensure_ascii=False))
    return results

if __name__ == "__main__":
    run()
