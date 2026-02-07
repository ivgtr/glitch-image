import type { SliceDefinition } from './filter.js'

export interface GlitchParams {
  duration: string
  channelOffsets: {
    red: { values: string; keyTimes: string }
    blue: { values: string; keyTimes: string }
  }
  slices: SliceDefinition[]
}

function createRng(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function lerp(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(lerp(rng, min, max + 1))
}

function generateKeyTimes(rng: () => number, steps: number): string {
  const times = [0]
  for (let i = 1; i < steps - 1; i++) {
    times.push(rng())
  }
  times.sort((a, b) => a - b)
  times.push(1)
  return times.map((t) => t.toFixed(2).replace(/\.?0+$/, '') || '0').join('; ')
}

function generateChannelValues(
  rng: () => number,
  steps: number,
  min: number,
  max: number
): string {
  const values = [0]
  for (let i = 1; i < steps; i++) {
    const useZero = rng() < 0.3
    values.push(useZero ? 0 : lerp(rng, min, max))
  }
  return values.map((v) => v.toFixed(2).replace(/\.?0+$/, '') || '0').join('; ')
}

function generateSliceValues(rng: () => number, steps: number): string {
  const values = [0]
  for (let i = 1; i < steps; i++) {
    const useZero = rng() < 0.25
    values.push(useZero ? 0 : lerp(rng, -0.2, 0.2))
  }
  return values.map((v) => v.toFixed(2).replace(/\.?0+$/, '') || '0').join('; ')
}

export function generateGlitchParams(seed: number): GlitchParams {
  const rng = createRng(seed)

  const duration = `${lerp(rng, 2, 5).toFixed(1)}s`

  const redSteps = randInt(rng, 3, 6)
  const blueSteps = randInt(rng, 3, 6)

  const channelOffsets = {
    red: {
      values: generateChannelValues(rng, redSteps, -0.12, -0.02),
      keyTimes: generateKeyTimes(rng, redSteps)
    },
    blue: {
      values: generateChannelValues(rng, blueSteps, 0.02, 0.12),
      keyTimes: generateKeyTimes(rng, blueSteps)
    }
  }

  const sliceCount = randInt(rng, 5, 9)
  const animatedCount = randInt(rng, 1, Math.ceil(sliceCount / 2))

  const heights: number[] = []
  let remaining = 100
  for (let i = 0; i < sliceCount - 1; i++) {
    const maxH = remaining - (sliceCount - 1 - i)
    const h = Math.max(1, randInt(rng, 1, Math.max(1, Math.floor(maxH / 2))))
    heights.push(h)
    remaining -= h
  }
  heights.push(remaining)

  const animatedIndices = new Set<number>()
  while (animatedIndices.size < animatedCount) {
    animatedIndices.add(randInt(rng, 0, sliceCount - 1))
  }

  let yPos = 0
  const slices: SliceDefinition[] = heights.map((h, i) => {
    const slice: SliceDefinition = {
      y: `${yPos}%`,
      height: `${h}%`,
      result: `slice${i + 1}`
    }
    if (animatedIndices.has(i)) {
      const steps = randInt(rng, 3, 9)
      slice.animation = {
        values: generateSliceValues(rng, steps),
        keyTimes: generateKeyTimes(rng, steps)
      }
    }
    yPos += h
    return slice
  })

  return { duration, channelOffsets, slices }
}
