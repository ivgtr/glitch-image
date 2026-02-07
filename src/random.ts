import type { SliceDefinition } from './filter.js'

export interface GlitchParams {
  duration: string
  channelOffsets: {
    red: { values: string; keyTimes: string }
    blue: { values: string; keyTimes: string }
  }
  slices: SliceDefinition[]
}

type DelayType = 'FLASH' | 'QUICK' | 'NORMAL' | 'FREEZE'

interface Frame {
  dx: number
  delay: DelayType
}

const DELAY_RATIOS: Record<DelayType, number> = {
  FLASH: 0.03,
  QUICK: 0.06,
  NORMAL: 0.12,
  FREEZE: 0.25
} as const

const RHYTHM_PATTERNS: DelayType[][] = [
  ['NORMAL', 'FLASH', 'QUICK', 'FLASH'],
  ['FLASH', 'FREEZE', 'FLASH', 'QUICK'],
  ['FLASH', 'QUICK', 'NORMAL', 'FREEZE'],
  ['QUICK', 'NORMAL', 'QUICK', 'FLASH'],
  ['FLASH', 'FLASH', 'FLASH', 'QUICK'],
  ['FLASH', 'FREEZE', 'FLASH', 'FREEZE'],
  ['FLASH', 'FLASH', 'QUICK', 'NORMAL']
]

const PHI = 1.618

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

function selectRhythmPattern(rng: () => number): DelayType[] {
  return RHYTHM_PATTERNS[randInt(rng, 0, RHYTHM_PATTERNS.length - 1)]
}

function buildTensionCurve(rng: () => number, steps: number): number[] {
  const intensities: number[] = []
  const remaining = steps
  const buildupCount = Math.max(1, Math.round((remaining * PHI) / (PHI + 1)))
  const climaxCount = randInt(rng, 1, 2)
  const releaseCount = Math.max(1, steps - buildupCount - climaxCount)
  const actualBuildupCount = steps - climaxCount - releaseCount

  for (let i = 0; i < actualBuildupCount; i++) {
    const t = actualBuildupCount === 1 ? 1 : i / (actualBuildupCount - 1)
    intensities.push(0.1 + 0.9 * t * t)
  }

  for (let i = 0; i < climaxCount; i++) {
    intensities.push(lerp(rng, 0.9, 1.0))
  }

  for (let i = 0; i < releaseCount; i++) {
    const t = releaseCount === 1 ? 1 : i / (releaseCount - 1)
    intensities.push(0.6 * (1 - t))
  }

  return intensities
}

function buildFrameSequence(
  rng: () => number,
  intensities: number[],
  rhythm: DelayType[],
  min: number,
  max: number
): Frame[] {
  const frames: Frame[] = [{ dx: 0, delay: 'QUICK' }]

  for (let i = 0; i < intensities.length; i++) {
    const intensity = intensities[i]
    const breathChance = intensity > 0.7 ? 0.1 : intensity > 0.3 ? 0.3 : 0.6

    if (rng() < breathChance) {
      const breathDelay: DelayType = intensity > 0.7 ? 'QUICK' : 'FREEZE'
      frames.push({ dx: 0, delay: breathDelay })
    }

    const amplitude = intensity * (max - min)
    const dx = min + rng() * amplitude * (rng() < 0.5 ? 1 : -1)
    const delay = rhythm[i % rhythm.length]
    frames.push({ dx, delay })
  }

  frames.push({ dx: 0, delay: 'NORMAL' })
  return frames
}

function formatValue(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '') || '0'
}

function framesToValuesAndKeyTimes(frames: Frame[]): { values: string; keyTimes: string } {
  const totalRatio = frames.reduce((sum, f) => sum + DELAY_RATIOS[f.delay], 0)

  const values: string[] = []
  const keyTimes: string[] = []
  let cumulative = 0

  for (let i = 0; i < frames.length; i++) {
    values.push(formatValue(frames[i].dx))
    keyTimes.push(formatValue(cumulative))
    cumulative += DELAY_RATIOS[frames[i].delay] / totalRatio
  }

  keyTimes[keyTimes.length - 1] = '1'

  return {
    values: values.join('; '),
    keyTimes: keyTimes.join('; ')
  }
}

function generateChannelValues(
  rng: () => number,
  steps: number,
  min: number,
  max: number
): { values: string; keyTimes: string } {
  const rhythm = selectRhythmPattern(rng)
  const intensities = buildTensionCurve(rng, steps)
  const frames = buildFrameSequence(rng, intensities, rhythm, min, max)
  return framesToValuesAndKeyTimes(frames)
}

function generateSliceValues(
  rng: () => number,
  steps: number
): { values: string; keyTimes: string } {
  const rhythm = selectRhythmPattern(rng)
  const intensities = buildTensionCurve(rng, steps)
  const frames = buildFrameSequence(rng, intensities, rhythm, -0.2, 0.2)
  return framesToValuesAndKeyTimes(frames)
}

export function generateGlitchParams(seed: number): GlitchParams {
  const rng = createRng(seed)

  const duration = `${lerp(rng, 2, 5).toFixed(1)}s`

  const redSteps = randInt(rng, 5, 10)
  const blueSteps = randInt(rng, 5, 10)

  const channelOffsets = {
    red: generateChannelValues(rng, redSteps, -0.12, -0.02),
    blue: generateChannelValues(rng, blueSteps, 0.02, 0.12)
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
      const steps = randInt(rng, 5, 12)
      slice.animation = generateSliceValues(rng, steps)
    }
    yPos += h
    return slice
  })

  return { duration, channelOffsets, slices }
}
