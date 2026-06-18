import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

const SIZE = { width: 1200, height: 630 }

// Brand palette
const CANVAS = '#FBF9F1'
const FOREST = '#1A4D3A'
const WINE = '#8B2635'
const KRAFT = '#C29B74'

// Load only the glyphs we render (keeps the 中文 font payload tiny)
async function loadGoogleFont(text: string, weight: number) {
  const family = `Noto+Sans+TC:wght@${weight}`
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+?)\) format\(/)
  if (resource) {
    const res = await fetch(resource[1])
    if (res.status === 200) return res.arrayBuffer()
  }
  throw new Error('failed to load Noto Sans TC subset')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteName = 'Guo-En Blog'
  const title = searchParams.get('title') || siteName
  const date = searchParams.get('date') || ''
  const tags = (searchParams.get('tags') || '')
    .split(',')
    .filter(Boolean)
    .slice(0, 3)
    .map((t) => `#${t}`)

  // Every character that appears, so the subset covers it
  const text = `${title}${siteName}${date}${tags.join('')}`
  const [regular, bold] = await Promise.all([loadGoogleFont(text, 400), loadGoogleFont(text, 700)])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: CANVAS,
        padding: 40,
        fontFamily: 'Noto Sans TC',
      }}
    >
      {/* Green border frame */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: `6px solid ${FOREST}`,
          borderRadius: 24,
          padding: '56px 64px',
        }}
      >
        {/* Site name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: WINE }} />
          <div style={{ fontSize: 32, fontWeight: 700, color: FOREST }}>{siteName}</div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 24 ? 60 : 72,
            fontWeight: 700,
            color: FOREST,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>

        {/* Footer: date + tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {date && <div style={{ fontSize: 28, color: KRAFT, fontWeight: 700 }}>{date}</div>}
          <div style={{ display: 'flex', gap: 16 }}>
            {tags.map((tag) => (
              <div key={tag} style={{ fontSize: 28, color: WINE, fontWeight: 400 }}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: 'Noto Sans TC', data: regular, weight: 400, style: 'normal' },
        { name: 'Noto Sans TC', data: bold, weight: 700, style: 'normal' },
      ],
    }
  )
}
