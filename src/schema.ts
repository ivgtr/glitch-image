import * as v from 'valibot'

const isPrivateIP = (hostname: string): boolean => {
  const patterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^\[?::1\]?$/,
    /^\[?fe80:/i,
    /^\[?fc00:/i,
    /^\[?fd/i
  ]
  return patterns.some((p) => p.test(hostname))
}

const hexColor = v.pipe(
  v.string(),
  v.regex(/^[0-9a-fA-F]{3,6}$/, 'Must be a 3-6 digit hex color code')
)

const dimension = v.pipe(
  v.string(),
  v.transform(Number),
  v.number('Must be a valid number'),
  v.minValue(1, 'Must be at least 1'),
  v.maxValue(4096, 'Must be at most 4096')
)

const fontSizeSchema = v.pipe(
  v.string(),
  v.transform(Number),
  v.number('Must be a valid number'),
  v.minValue(1, 'Must be at least 1'),
  v.maxValue(500, 'Must be at most 500')
)

const urlSchema = v.pipe(
  v.string(),
  v.url('Must be a valid URL'),
  v.check((value: string) => {
    try {
      const parsed = new URL(value)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false
      return !isPrivateIP(parsed.hostname)
    } catch {
      return false
    }
  }, 'Must be a public http/https URL')
)

const QuerySchema = v.object({
  text: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(200))),
  url: v.optional(urlSchema),
  width: v.optional(dimension),
  height: v.optional(dimension),
  color: v.optional(hexColor),
  darkColor: v.optional(hexColor),
  fontSize: v.optional(fontSizeSchema)
})

export type QueryInput = {
  text?: string | string[]
  url?: string | string[]
  width?: string | string[]
  height?: string | string[]
  color?: string | string[]
  darkColor?: string | string[]
  fontSize?: string | string[]
}

export type ValidatedQuery = v.InferOutput<typeof QuerySchema>

export function validateQuery(query: QueryInput): ValidatedQuery {
  const normalized: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(query)) {
    normalized[key] = Array.isArray(value) ? value[0] : value
  }
  return v.parse(QuerySchema, normalized)
}
