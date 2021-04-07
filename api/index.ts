import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { query } from '../src/@types/Query.d'
import { createElement } from '../src/svg'

const CACHE_MAX_AGE = 60 * 60 * 2

export default async (req: VercelRequest & { query: query }, res: VercelResponse) => {
  const { text, url, width, height, color, darkColor, fontSize } = req.query

  const svg = await createElement({ text, url, width, height, color, darkColor, fontSize })

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`
  })
  res.end(svg)
}
