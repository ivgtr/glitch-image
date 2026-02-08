import type { SliceDefinition } from './filter.js'

export interface GlitchParams {
  duration: string
  channelOffsets: {
    red: { values: string; keyTimes: string }
    blue: { values: string; keyTimes: string }
  }
  slices: SliceDefinition[]
}

interface PhaseConfig {
  rest1: number
  spark: number
  rest2: number
  climax: number
  sustain: number
}

interface GlitchProfile {
  channelRange: number
  sliceRange: number
  duration: number
  climaxFrameCount: number
}

interface PhaseFrame {
  dx: number
  time: number
}

interface DirectionPattern {
  spark: number
  climax: number[]
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

function generateProfile(rng: () => number): GlitchProfile {
  return {
    channelRange: lerp(rng, 0.03, 0.07),
    sliceRange: lerp(rng, 0.08, 0.2),
    duration: lerp(rng, 2.5, 5.0),
    climaxFrameCount: randInt(rng, 3, 8)
  }
}

function generatePhaseConfig(rng: () => number): PhaseConfig {
  const rest1 = lerp(rng, 0.2, 0.35)
  const spark = lerp(rng, 0.02, 0.05)
  const rest2 = lerp(rng, 0.25, 0.4)
  const climax = lerp(rng, 0.1, 0.25)
  const sustain = lerp(rng, 0.05, 0.15)

  const total = rest1 + spark + rest2 + climax + sustain
  return {
    rest1: rest1 / total,
    spark: spark / total,
    rest2: rest2 / total,
    climax: climax / total,
    sustain: sustain / total
  }
}

function buildDirectionPattern(rng: () => number, maxFrameCount: number): DirectionPattern {
  const spark = rng() < 0.5 ? 1 : -1

  const climax: number[] = []
  let dir = rng() < 0.5 ? 1 : -1
  let runLen = 0
  let targetRun = randInt(rng, 2, 4)

  for (let i = 0; i < maxFrameCount; i++) {
    climax.push(dir)
    runLen++
    if (runLen >= targetRun) {
      dir *= -1
      runLen = 0
      targetRun = randInt(rng, 2, 4)
    }
  }

  return { spark, climax }
}

function buildPhaseFrames(
  rng: () => number,
  maxDx: number,
  climaxFrameCount: number,
  sharedPhase?: PhaseConfig,
  sharedPattern?: DirectionPattern
): PhaseFrame[] {
  const phase = sharedPhase ?? generatePhaseConfig(rng)
  const frames: PhaseFrame[] = []

  // REST1: 静止
  frames.push({ dx: 0, time: 0 })

  // SPARK: 一瞬のグリッチ + リセット
  const sparkDir = sharedPattern ? sharedPattern.spark : rng() < 0.5 ? 1 : -1
  const sparkDx = lerp(rng, 0.5, 1.0) * maxDx * sparkDir
  frames.push({ dx: sparkDx, time: phase.rest1 })
  frames.push({ dx: 0, time: phase.rest1 + phase.spark * 0.5 })

  // REST2: 再び静止（sparkリセット位置からclimaxまで自動的に静止）

  // CLIMAX: 高密度のグリッチフレーム
  const climaxStart = phase.rest1 + phase.spark + phase.rest2
  const climaxStepSize = phase.climax / climaxFrameCount
  for (let i = 0; i < climaxFrameCount; i++) {
    const intensity = lerp(rng, 0.6, 1.0)
    const dir = sharedPattern
      ? sharedPattern.climax[i % sharedPattern.climax.length]
      : rng() < 0.5
        ? 1
        : -1
    const dx = intensity * maxDx * dir
    frames.push({ dx, time: climaxStart + i * climaxStepSize })
  }

  // SUSTAIN: 最後のCLIMAXフレームの値を保持
  const lastClimaxDx = frames[frames.length - 1].dx
  frames.push({ dx: lastClimaxDx, time: climaxStart + phase.climax })
  frames.push({ dx: 0, time: 1 })

  return frames
}

function formatValue(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '') || '0'
}

function framesToValuesAndKeyTimes(frames: PhaseFrame[]): {
  values: string
  keyTimes: string
} {
  const values = frames.map((f) => formatValue(f.dx)).join('; ')
  const keyTimes = frames.map((f) => formatValue(f.time)).join('; ')
  return { values, keyTimes }
}

function generateSymmetricChannels(
  rng: () => number,
  channelRange: number,
  climaxFrameCount: number
): {
  red: { values: string; keyTimes: string }
  blue: { values: string; keyTimes: string }
} {
  const baseFrames = buildPhaseFrames(rng, channelRange, climaxFrameCount)

  const redFrames = baseFrames.map((f) => {
    const wobble = f.dx !== 0 ? lerp(rng, 0.8, 1.2) : 1
    return { dx: -Math.abs(f.dx) * wobble, time: f.time }
  })

  const blueFrames = baseFrames.map((f) => {
    const wobble = f.dx !== 0 ? lerp(rng, 0.8, 1.2) : 1
    return { dx: Math.abs(f.dx) * wobble, time: f.time }
  })

  return {
    red: framesToValuesAndKeyTimes(redFrames),
    blue: framesToValuesAndKeyTimes(blueFrames)
  }
}

function generateSlices(rng: () => number, profile: GlitchProfile): SliceDefinition[] {
  const sliceCount = randInt(rng, 8, 16)

  // 1. ランダムな重みを生成し、100%に正規化
  const rawWeights: number[] = []
  for (let i = 0; i < sliceCount; i++) {
    rawWeights.push(lerp(rng, 0.5, 1.5))
  }
  const totalWeight = rawWeights.reduce((sum, w) => sum + w, 0)
  const heights = rawWeights.map((w) => Math.max(3, Math.round((w / totalWeight) * 100)))

  // 丸め誤差を最大スライスで吸収
  const summed = heights.reduce((sum, h) => sum + h, 0)
  const maxIdx = heights.indexOf(Math.max(...heights))
  heights[maxIdx] += 100 - summed

  // 2. アニメーション付きスライスを均等間隔で選択
  const animatedCount = Math.ceil(sliceCount / 3)
  const animatedIndices = new Set<number>()
  const step = Math.floor(sliceCount / animatedCount)
  const offset = randInt(rng, 0, step - 1)
  for (let i = 0; i < animatedCount; i++) {
    animatedIndices.add(Math.min(offset + i * step, sliceCount - 1))
  }

  // 3. heroスライスを決定（アニメ付きの中で最小高さ）
  const animatedArray = [...animatedIndices]
  animatedArray.sort((a, b) => heights[a] - heights[b])
  const heroIndex = animatedArray[0]

  // 4. 全スライスで共有するタイミングと方向パターン
  const sharedPhase = generatePhaseConfig(rng)
  const heroFrameCount = Math.max(profile.climaxFrameCount + 2, 7)
  const sharedPattern = buildDirectionPattern(rng, heroFrameCount)

  // 5. スライス定義を構築
  let yPos = 0
  return heights.map((h, i) => {
    const slice: SliceDefinition = {
      y: `${yPos}%`,
      height: `${h}%`,
      result: `slice${i + 1}`
    }
    if (animatedIndices.has(i)) {
      const isHero = i === heroIndex
      const frameCount = isHero ? heroFrameCount : randInt(rng, 3, 5)
      const maxDx = profile.sliceRange * lerp(rng, 0.8, 1.2)
      const frames = buildPhaseFrames(rng, maxDx, frameCount, sharedPhase, sharedPattern)
      slice.animation = framesToValuesAndKeyTimes(frames)
    }
    yPos += h
    return slice
  })
}

// seed 429636: 元の手動パターン（rest1≈0.30, spark≈0.03, rest2≈0.37, climax≈0.20, sustain≈0.10）に近い比率を生成する
export function generateGlitchParams(seed: number): GlitchParams {
  const rng = createRng(seed)
  const profile = generateProfile(rng)

  const duration = `${profile.duration.toFixed(1)}s`
  const channelOffsets = generateSymmetricChannels(
    rng,
    profile.channelRange,
    profile.climaxFrameCount
  )
  const slices = generateSlices(rng, profile)

  return { duration, channelOffsets, slices }
}
