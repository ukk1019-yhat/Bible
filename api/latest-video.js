/**
 * Vercel Serverless Function to fetch the latest video(s)
 * from the official YouTube channel (@sudhaword / Church of The Living God).
 *
 * Channel ID: UCs7Wzy1D3_P_225-L6Ay5_A
 * URL: https://www.youtube.com/@sudhaword/videos
 */

export default async function handler(req, res) {
  const channelId = 'UCs7Wzy1D3_P_225-L6Ay5_A'

  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SatyaSakshi/1.0; +https://www.satyasakshi.in)',
      },
    })

    if (!response.ok) {
      throw new Error(`YouTube RSS returned status ${response.status}`)
    }

    const xml = await response.text()
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1])

    const videos = entries
      .map((entry) => {
        const youtubeId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || ''
        const title = (entry.match(/<title>(.*?)<\/title>/)?.[1] || '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
        const publishedAt = entry.match(/<published>(.*?)<\/published>/)?.[1] || ''
        const fullDesc = (entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || '').trim()
        const descLines = fullDesc
          .split('\n')
          .map((l) => l.trim())
          .filter(
            (l) =>
              l &&
              !l.startsWith('👉🏼') &&
              !l.startsWith('http') &&
              !l.startsWith('#') &&
              !l.startsWith('~') &&
              !l.startsWith('Title :')
          )
        const description = descLines.slice(0, 2).join(' ') || title

        return {
          slug: `video-${youtubeId}`,
          title,
          description,
          youtubeId,
          category: 'బైబిల్ సందేశాలు',
          publishedAt,
          speaker: {
            name: 'Bro. Sudhakar CH.',
            slug: 'sudhakar',
          },
        }
      })
      .filter((v) => v.youtubeId)

    const payload = {
      success: true,
      latest: videos[0] || null,
      videos: videos.slice(0, 10),
      fetchedAt: new Date().toISOString(),
    }

    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400')
      return res.status(200).json(payload)
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    const errorPayload = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }

    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      return res.status(500).json(errorPayload)
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

