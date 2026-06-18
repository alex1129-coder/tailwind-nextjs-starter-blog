'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }

  // 暫時隱藏留言區：未設定 giscus 環境變數前不顯示。
  // 在 .env.local（本機）與 Vercel（線上）填入 giscus ID 後會自動顯示。
  if (siteMetadata.comments.provider === 'giscus' && !siteMetadata.comments.giscusConfig?.repo) {
    return null
  }
  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
