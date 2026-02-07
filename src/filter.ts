import tag from './tag.js'

function createColorMatrices(): string {
  return [
    tag('feColorMatrix', {
      in: 'SourceGraphic',
      result: 'red',
      type: 'matrix',
      values: '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'
    }),
    tag('feColorMatrix', {
      in: 'SourceGraphic',
      result: 'green',
      type: 'matrix',
      values: '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0'
    }),
    tag('feColorMatrix', {
      in: 'SourceGraphic',
      result: 'blue',
      type: 'matrix',
      values: '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0'
    })
  ].join('')
}

function createChannelOffsets(): string {
  return [
    tag(
      'feOffset',
      { in: 'red', result: 'red-shifted', dx: '-0.05', dy: '0' },
      tag('animate', {
        attributeName: 'dx',
        values: '0; -0.05; 0; -0.07; -0.07',
        keyTimes: '0; 0.3; 0.33; 0.7; 0.75',
        begin: '0s',
        dur: '3s',
        calcMode: 'discrete',
        repeatCount: 'indefinite',
        fill: 'freeze'
      })
    ),
    tag(
      'feOffset',
      { in: 'blue', result: 'blue-shifted', dx: '0.05', dy: '0' },
      tag('animate', {
        attributeName: 'dx',
        values: '0; 0.05; 0; 0.07; 0.07',
        keyTimes: '0; 0.3; 0.33; 0.7; 0.75',
        begin: '0s',
        dur: '3s',
        calcMode: 'discrete',
        repeatCount: 'indefinite',
        fill: 'freeze'
      })
    )
  ].join('')
}

function createBlendOperations(): string {
  return [
    tag('feBlend', { mode: 'screen', in: 'red-shifted', in2: 'green', result: 'red-green' }),
    tag('feBlend', { mode: 'screen', in: 'red-green', in2: 'blue-shifted', result: 'blended' })
  ].join('')
}

interface SliceDefinition {
  y: string
  height: string
  result: string
  animation?: {
    values: string
    keyTimes: string
  }
}

const SLICES: SliceDefinition[] = [
  { y: '0%', height: '30%', result: 'slice1' },
  {
    y: '30%',
    height: '10%',
    result: 'slice2',
    animation: { values: '0; -0.05; 0; -0.1', keyTimes: '0; 0.3; 0.33; 0.7' }
  },
  { y: '40%', height: '10%', result: 'slice3' },
  {
    y: '50%',
    height: '2%',
    result: 'slice4',
    animation: { values: '0; 0.1; 0; 0.1; 0.2', keyTimes: '0; 0.3; 0.33; 0.7; 0.75' }
  },
  { y: '52%', height: '12%', result: 'slice5' },
  {
    y: '64%',
    height: '3%',
    result: 'slice6',
    animation: {
      values: '0; -0.05; 0; -0.01; -0.15; -0.1; -0.15; -0.1; -0.15',
      keyTimes: '0; 0.3; 0.33; 0.8; 0.82; 0.84; 0.86; 0.88; 0.9'
    }
  },
  { y: '67%', height: '33%', result: 'slice7' }
]

function createGlitchSlices(): string {
  return SLICES.map((slice) => {
    const attrs = {
      in: 'blended',
      dx: '0',
      dy: '0',
      y: slice.y,
      height: slice.height,
      result: slice.result
    }

    if (slice.animation) {
      return tag(
        'feOffset',
        attrs,
        tag('animate', {
          attributeName: 'dx',
          values: slice.animation.values,
          keyTimes: slice.animation.keyTimes,
          begin: '0s',
          dur: '3s',
          calcMode: 'discrete',
          repeatCount: 'indefinite',
          fill: 'freeze'
        })
      )
    }

    return tag('feOffset', attrs)
  }).join('')
}

function createMergeNode(): string {
  return tag(
    'feMerge',
    {},
    ...SLICES.map((slice) => tag('feMergeNode', { in: slice.result }))
  )
}

export function createGlitchFilter(): string {
  return tag(
    'defs',
    {},
    tag(
      'filter',
      {
        id: 'glitch',
        primitiveUnits: 'objectBoundingBox',
        x: '-10%',
        y: '-10%',
        width: '120%',
        height: '120%'
      },
      createColorMatrices(),
      createChannelOffsets(),
      createBlendOperations(),
      createGlitchSlices(),
      createMergeNode()
    )
  )
}
