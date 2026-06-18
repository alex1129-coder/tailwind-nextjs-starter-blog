import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' with { type: 'json' }
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { slug } from 'github-slugger'

// IndexNow ownership key. MUST match the filename of public/<KEY>.txt
// (IndexNow proves ownership by fetching https://<host>/<KEY>.txt and checking it contains this key).
const KEY = 'a5d40475424ab87a5dc04df76d37903c'

async function indexnow() {
  // Only notify search engines on real production deploys — skip local/preview builds.
  if (process.env.VERCEL_ENV !== 'production') {
    console.log('IndexNow skipped (not a production deploy).')
    return
  }

  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  const host = new URL(siteUrl).host

  const staticRoutes = ['', 'blog', 'projects', 'tags', 'about'].map((r) =>
    r ? `${siteUrl}/${r}/` : `${siteUrl}/`
  )
  const tagRoutes = Object.keys(tagData).map((t) => `${siteUrl}/tags/${slug(t)}/`)
  const postRoutes = allBlogs.filter((p) => p.draft !== true).map((p) => `${siteUrl}/${p.path}/`)

  const urlList = [...new Set([...staticRoutes, ...tagRoutes, ...postRoutes])]

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: KEY,
        keyLocation: `${siteUrl}/${KEY}.txt`,
        urlList,
      }),
    })
    console.log(`IndexNow submitted ${urlList.length} URLs — HTTP ${res.status}`)
  } catch (err) {
    // Never fail the build because of IndexNow.
    console.warn('IndexNow submission failed:', err.message)
  }
}

export default indexnow
