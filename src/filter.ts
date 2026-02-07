import type { GlitchParams } from './random.js'
import tag from './tag.js'

export interface SliceDefinition {
  y: string
  height: string
  result: string
  animation?: {
    values: string
    keyTimes: string
  }
}

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

function createChannelOffsets(params: GlitchParams): string {
  return [
    tag(
      'feOffset',
      { in: 'red', result: 'red-shifted', dx: '-0.05', dy: '0' },
      tag('animate', {
        attributeName: 'dx',
        values: params.channelOffsets.red.values,
        keyTimes: params.channelOffsets.red.keyTimes,
        begin: '0s',
        dur: params.duration,
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
        values: params.channelOffsets.blue.values,
        keyTimes: params.channelOffsets.blue.keyTimes,
        begin: '0s',
        dur: params.duration,
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

function createGlitchSlices(params: GlitchParams): string {
  return params.slices
    .map((slice) => {
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
            dur: params.duration,
            calcMode: 'discrete',
            repeatCount: 'indefinite',
            fill: 'freeze'
          })
        )
      }

      return tag('feOffset', attrs)
    })
    .join('')
}

function createMergeNode(params: GlitchParams): string {
  return tag(
    'feMerge',
    {},
    ...params.slices.map((slice) => tag('feMergeNode', { in: slice.result }))
  )
}

export function createGlitchFilter(params: GlitchParams): string {
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
      createChannelOffsets(params),
      createBlendOperations(),
      createGlitchSlices(params),
      createMergeNode(params)
    )
  )
}
