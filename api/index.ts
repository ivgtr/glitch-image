import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createElement } from '../src/svg'

type query = {
  text?: string
  url?: string
  width?: string
  height?: string
  color?: string
  darkColor?: string
  fontSize?: string
}

export default async (req: VercelRequest & { query: query }, res: VercelResponse) => {
  const { text, url, width, height, color, darkColor, fontSize } = req.query

  const svg = await createElement({ text, url, width, height, color, darkColor, fontSize })

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml'
  })
  res.end(svg)
}
