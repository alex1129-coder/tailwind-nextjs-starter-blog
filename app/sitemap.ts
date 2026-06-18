import { MetadataRoute } from 'next'
import { slug } from 'github-slugger'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}/`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blog', 'projects', 'tags', 'about'].map((route) => ({
    url: route ? `${siteUrl}/${route}/` : `${siteUrl}/`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const tagRoutes = Object.keys(tagData as Record<string, number>).map((tag) => ({
    url: `${siteUrl}/tags/${slug(tag)}/`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...tagRoutes, ...blogRoutes]
}
