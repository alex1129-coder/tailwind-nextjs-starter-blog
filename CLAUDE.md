# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn dev          # Start dev server at localhost:3000

# Build
yarn build        # Build + postbuild (generates RSS feed, sitemap, search index)
yarn serve        # Start production server

# Lint
yarn lint         # ESLint with auto-fix (pages, app, components, lib, layouts, scripts)

# Bundle analysis
yarn analyze      # Build with bundle analyzer enabled
```

**Package manager**: yarn 3.6.1 (must use yarn, not npm/pnpm)

## Architecture

### Content Layer (Contentlayer2)

All blog content lives in `data/` as MDX files. Contentlayer2 processes them at build time:
- `data/blog/**/*.mdx` → `Blog` document type (required fields: `title`, `date`)
- `data/authors/**/*.mdx` → `Authors` document type
- On build success, auto-generates `app/tag-data.json` (tag counts) and `public/search.json` (kbar search index)
- Config: `contentlayer.config.ts`

### App Router Structure

```
app/
  layout.tsx          # Root layout: ThemeProviders → SearchProvider → Header/Footer
  page.tsx            # Homepage (uses Main.tsx)
  blog/[...slug]/     # Individual post pages
  tags/[tag]/         # Tag-filtered post lists
  about/              # Author page
  projects/           # Projects page
```

### Key Configuration Files

- `data/siteMetadata.js` — Central config: site URL, social links, analytics, comments (giscus), search (kbar/algolia), newsletter provider
- `data/headerNavLinks.ts` — Navigation items
- `next.config.js` — Wraps config with `withContentlayer` + `withBundleAnalyzer`; handles SVG via @svgr/webpack

### Layouts

Posts render through one of these layout components (specified via `layout` frontmatter field):
- `PostLayout` (default) — Full layout with TOC and author info
- `PostSimple` — Minimal layout
- `PostBanner` — With banner image
- `ListLayout` / `ListLayoutWithTags` — Blog listing pages

### Styling

Tailwind CSS v4 with custom brand palette defined in `css/tailwind.css`:
- `--color-canvas: #FBF9F1` — Page background (帆布奶油白)
- `--color-forest: #1A4D3A` — Navbar/footer/primary (森林深綠)
- `--color-wine: #8B2635` — Accent/hover (復古酒紅)
- `--color-kraft: #C29B74` — Secondary/borders (牛皮紙褐)
- `--color-primary-*` maps to forest green scale (500 = `#1A4D3A`)

Dark mode uses `.dark` class variant via `next-themes`.

### pliny Library

`pliny` provides reusable blog utilities: analytics wrappers, search providers (kbar/algolia), comment wrappers (giscus/utterances/disqus), MDX plugins, and `allCoreContent`/`sortPosts` helpers. Source is in `node_modules/pliny` but Tailwind is configured to scan it (`@source '../node_modules/pliny'`).

### Post Frontmatter

```yaml
title: required
date: required
tags: [optional, list]
draft: false          # excluded from production builds
summary: string
authors: [default]    # maps to data/authors/*.mdx
layout: PostLayout    # layout component to use
images: [url]
bibliography: path    # for citation support
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_UMAMI_ID` | Umami analytics website ID |
| `NEXT_PUBLIC_GISCUS_REPO` | Giscus comments repo |
| `NEXT_PUBLIC_GISCUS_REPOSITORY_ID` | Giscus repo ID |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | Giscus category name |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | Giscus category ID |
| `BASE_PATH` | For subdirectory deployment |
| `EXPORT` | Set to enable static export mode |
| `UNOPTIMIZED` | Disable Next.js image optimization |

## Deployment

- **Platform**: Vercel
- **Production domain**: gouen.dev

## Adding Content

- New blog post: create `data/blog/your-post.mdx` with required frontmatter
- Nested routes: `data/blog/series/part-1.mdx` → URL `/blog/series/part-1`
- New author: create `data/authors/name.mdx`
- Custom MDX components: register in `components/MDXComponents.tsx`
