import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import Main from './Main'
import tagData from './tag-data.json'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const authors = allCoreContent(allAuthors)
  const author = authors.find((a) => a.slug === 'default') ?? authors[0]

  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.title,
    url: `${siteUrl}/`,
    description: siteMetadata.description,
    inLanguage: siteMetadata.locale,
    ...(author
      ? { author: { '@type': 'Person', name: author.name, url: `${siteUrl}/about` } }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Main posts={posts} author={author} tags={tagData} />
    </>
  )
}
