import type { VercelRequest, VercelResponse } from '@vercel/node'
import { AxiosError } from 'axios'
import * as v from 'valibot'
import type { QueryInput } from '../src/schema.js'
import { validateQuery } from '../src/schema.js'
import { createElement } from '../src/svg.js'

const CACHE_MAX_AGE = 60 * 60 * 2

const SEED_INTERVAL_SECONDS = CACHE_MAX_AGE

function computeTimeSeed(): number {
  return Math.floor(Math.floor(Date.now() / 1000) / SEED_INTERVAL_SECONDS)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const query = validateQuery(req.query as QueryInput)
    const seed = query.seed ?? computeTimeSeed()
    const svg = await createElement({ ...query, seed })

    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`
    })
    res.end(svg)
  } catch (error) {
    if (error instanceof v.ValiError) {
      res.status(400).json({
        error: 'Validation Error',
        issues: error.issues.map((issue) => issue.message)
      })
      return
    }

    if (error instanceof AxiosError) {
      res.status(502).json({
        error: 'Failed to fetch external image'
      })
      return
    }

    console.error('Unhandled error:', error)
    res.status(500).json({
      error: 'Internal Server Error'
    })
  }
}
