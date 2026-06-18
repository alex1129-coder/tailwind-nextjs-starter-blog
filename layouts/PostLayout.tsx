import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import TableOfContents from '@/components/TableOfContents'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, children }: LayoutProps) {
  const { date, title, tags, toc } = content
  const tocItems = (toc as { value: string; url: string; depth: number }[]) ?? []

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        {/* Header */}
        <header className="border-b border-gray-200 pt-8 pb-6">
          <div className="space-y-3">
            <dl>
              <dt className="sr-only">發布於</dt>
              <dd className="text-sm font-medium text-gray-400">
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                </time>
              </dd>
            </dl>
            <PageTitle>{title}</PageTitle>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="pt-8">
          <div className="prose dark:prose-invert max-w-none pb-8">{children}</div>
          {siteMetadata.comments && (
            <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={content.slug} />
            </div>
          )}
        </div>
      </article>

      {/* Floating TOC */}
      <TableOfContents toc={tocItems} />
    </SectionContainer>
  )
}
