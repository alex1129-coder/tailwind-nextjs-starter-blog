import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import NewsletterWidget from '@/components/NewsletterWidget'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import type { Authors, Blog } from 'contentlayer/generated'
import type { CoreContent } from 'pliny/utils/contentlayer'

const MAX_DISPLAY = 5
const MAX_TAGS = 12

interface Props {
  posts: CoreContent<Blog>[]
  author?: CoreContent<Authors>
  tags: Record<string, number>
}

export default function Home({ posts, author, tags }: Props) {
  const sortedTags = Object.entries(tags).sort(([, a], [, b]) => b - a)

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      {/* Main: post list */}
      <div className="min-w-0 flex-1">
        <ul className="divide-y divide-gray-200">
          {!posts.length && <li className="py-10 text-gray-500">尚無文章。</li>}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags: postTags } = post
            return (
              <li key={slug} className="py-10">
                <article className="space-y-3">
                  <dl>
                    <dt className="sr-only">發布於</dt>
                    <dd className="text-sm font-medium text-gray-400">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-2">
                    <h2 className="text-xl leading-snug font-bold tracking-tight">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-[#112E23] hover:text-[#1A4D3A] dark:text-[#E0DAC8] dark:hover:text-[#9CBFB3]"
                      >
                        {title}
                      </Link>
                    </h2>
                    <div className="flex flex-wrap">
                      {postTags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-gray-500">{summary}</p>
                  <div className="text-sm font-medium">
                    <Link
                      href={`/blog/${slug}`}
                      className="text-primary-500 hover:text-primary-600"
                      aria-label={`閱讀更多：「${title}」`}
                    >
                      閱讀更多 →
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-center pt-2 text-sm font-medium">
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600"
              aria-label="所有文章"
            >
              所有文章 →
            </Link>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-full shrink-0 lg:w-56 xl:w-60">
        <div className="sticky top-24 space-y-8">
          {/* About Me */}
          {author && (
            <div>
              <h3 className="mb-4 border-b-2 border-[#1A4D3A] pb-1 text-sm font-bold text-[#1A4D3A] dark:border-[#6FA598] dark:text-[#9CBFB3]">
                關於我
              </h3>
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={72}
                  height={72}
                  className="mb-3 rounded-full"
                />
              )}
              <p className="font-semibold text-[#112E23] dark:text-[#E0DAC8]">{author.name}</p>
              {author.occupation && (
                <p className="mt-1 text-sm text-gray-500">{author.occupation}</p>
              )}
              {author.university && <p className="text-sm text-gray-500">{author.university}</p>}
              <Link
                href="/about"
                className="mt-3 inline-block rounded border border-[#1A4D3A] px-3 py-1 text-sm font-medium text-[#1A4D3A] transition-colors hover:bg-[#1A4D3A] hover:text-white dark:border-[#6FA598] dark:text-[#9CBFB3] dark:hover:bg-[#2D6B52]"
              >
                了解更多
              </Link>
            </div>
          )}

          {/* Categories */}
          {sortedTags.length > 0 && (
            <div>
              <h3 className="mb-4 border-b-2 border-[#1A4D3A] pb-1 text-sm font-bold text-[#1A4D3A] dark:border-[#6FA598] dark:text-[#9CBFB3]">
                文章分類
              </h3>
              <ul className="space-y-1">
                {sortedTags.slice(0, MAX_TAGS).map(([tagSlug, count]) => (
                  <li key={tagSlug}>
                    <Link
                      href={`/tags/${tagSlug}`}
                      className="flex items-center justify-between text-sm text-gray-600 hover:text-[#8B2635]"
                    >
                      <span>{tagSlug.replace(/-/g, ' ')}</span>
                      <span className="text-xs text-gray-400">({count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Newsletter */}
          {siteMetadata.newsletter?.provider && (
            <div>
              <h3 className="mb-4 border-b-2 border-[#1A4D3A] pb-1 text-sm font-bold text-[#1A4D3A] dark:border-[#6FA598] dark:text-[#9CBFB3]">
                電子報
              </h3>
              <NewsletterWidget />
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
