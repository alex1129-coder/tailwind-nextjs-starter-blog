'use client'

import { useEffect, useRef, useState } from 'react'

type TocItem = {
  value: string
  url: string
  depth: number
}

interface Props {
  toc: TocItem[]
}

export default function TableOfContents({ toc }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Active heading tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )
    const headings = document.querySelectorAll('article h2, article h3, article h4')
    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (!toc || toc.length < 2) return null

  return (
    <div ref={panelRef} className="fixed top-24 right-8 z-40">
      {/* Toggle button */}
      {/* TOC panel - opens downward */}
      <div
        className={`absolute top-14 right-0 max-h-[60vh] w-60 overflow-y-auto rounded-xl border border-gray-200 bg-[#FBF9F1] p-4 shadow-xl transition-all duration-200 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <h3 className="mb-3 border-b-2 border-[#1A4D3A] pb-1 text-sm font-bold text-[#1A4D3A]">
          大綱
        </h3>
        <nav aria-label="Table of contents">
          <ul className="space-y-2 text-sm">
            {toc.map((item) => {
              const id = item.url.replace(/^#/, '')
              const isActive = activeId === id
              return (
                <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
                  <a
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className={`block leading-snug transition-colors duration-150 ${
                      isActive
                        ? 'font-semibold text-[#1A4D3A]'
                        : 'text-gray-500 hover:text-[#8B2635]'
                    }`}
                  >
                    {item.value}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '關閉目錄' : '開啟目錄'}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1A4D3A] text-white shadow-md transition-colors hover:bg-[#8B2635]"
      >
        {open ? (
          // X icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          // List icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
