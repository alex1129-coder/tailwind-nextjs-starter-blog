import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({
  title: '關於',
  description: '認識許國恩 (Guo En)：從教育背景轉職前端工程師的歷程、技能，與這個部落格的初衷。',
})

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  const avatar = mainContent.avatar
    ? mainContent.avatar.includes('http')
      ? mainContent.avatar
      : siteUrl + mainContent.avatar
    : undefined
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: mainContent.name,
    url: `${siteUrl}/about`,
    image: avatar,
    jobTitle: mainContent.occupation,
    email: mainContent.email ? `mailto:${mainContent.email}` : undefined,
    alumniOf: mainContent.university
      ? { '@type': 'CollegeOrUniversity', name: mainContent.university }
      : undefined,
    sameAs: [siteMetadata.github, siteMetadata.linkedin].filter(Boolean),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
