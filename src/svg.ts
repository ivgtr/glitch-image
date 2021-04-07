import type { query } from './@types/Query'
import { createImageElement, createTextElement } from './calculator'
import s from './style'
import h from './tag'

const svgID = 'glitch-image'

export const createElement = async ({
  text = 'Glitch Image',
  url,
  width,
  height,
  color = '3f3f3f',
  darkColor = 'f3f3f3',
  fontSize = '10'
}: query): Promise<string> => {
  // const W = 1200
  // const H = 630

  const { content, ofset_w, ofset_h } = url
    ? await createImageElement({ url })
    : createTextElement({ text, fontSize })

  const element = h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: `0 0 ${width || ofset_w} ${height || ofset_h}`,
      id: svgID
    },
    h(
      'style',
      {},
      s('.text-centered', {
        font: `bold ${fontSize}px 'Source Code Pro', 'consolas', 'Menlo', 'Courier'`,
        fill: `#${color}`,
        dominantBaseline: 'middle',
        textAnchor: 'middle'
      }),
      s(
        '@media (prefers-color-scheme: dark)',
        {},
        s('.text-centered', {
          fill: `#${darkColor}`
        })
      )
    ),
    h(
      'svg',
      {
        width: width || ofset_w,
        height: height || ofset_h,
        x: 0,
        y: 0,
        class: 'box'
      },
      content
    ),
    h(
      'svg',
      {
        x: 0,
        y: 0
      },
      h(
        'defs',
        {},
        h(
          'filter',
          {
            id: 'glitch',
            primitiveUnits: 'objectBoundingBox',
            x: '-10%',
            y: '0%',
            width: '120%',
            height: '100%'
          },
          h('feColorMatrix', {
            in: 'SourceGraphic',
            result: 'red',
            type: 'matrix',
            values: '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'
          }),
          h('feColorMatrix', {
            in: 'SourceGraphic',
            result: 'green',
            type: 'matrix',
            values: '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0'
          }),
          h('feColorMatrix', {
            in: 'SourceGraphic',
            result: 'blue',
            type: 'matrix',
            values: '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0'
          }),
          h(
            'feOffset',
            { in: 'red', result: 'red-shifted', dx: '-0.05', dy: '0' },
            h('animate', {
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
          h(
            'feOffset',
            { in: 'blue', result: 'blue-shifted', dx: '0.05', dy: '0' },
            h('animate', {
              attributeName: 'dx',
              values: '0; 0.05; 0; 0.07; 0.07',
              keyTimes: '0; 0.3; 0.33; 0.7; 0.75',
              begin: '0s',
              dur: '3s',
              calcMode: 'discrete',
              repeatCount: 'indefinite',
              fill: 'freeze'
            })
          ),
          h('feBlend', { mode: 'screen', in: 'red-shifted', in2: 'green', result: 'red-green' }),
          h('feBlend', { mode: 'screen', in: 'red-green', in2: 'blue-shifted', result: 'blended' }),
          h('feOffset', {
            in: 'blended',
            dx: '0',
            dy: '0',
            y: '0%',
            height: '30%',
            result: 'slice1'
          }),
          h(
            'feOffset',
            {
              in: 'blended',
              dx: '0',
              dy: '0',
              y: '30%',
              height: '10%',
              result: 'slice2'
            },
            h('animate', {
              attributeName: 'dx',
              values: '0; -0.05; 0; -0.1',
              keyTimes: '0; 0.3; 0.33; 0.7',
              begin: '0s',
              dur: '3s',
              calcMode: 'discrete',
              repeatCount: 'indefinite',
              fill: 'freeze'
            })
          ),
          h('feOffset', {
            in: 'blended',
            dx: '0',
            dy: '0',
            y: '40%',
            height: '10%',
            result: 'slice3'
          }),
          h(
            'feOffset',
            {
              in: 'blended',
              dx: '0',
              dy: '0',
              y: '50%',
              height: '2%',
              result: 'slice4'
            },
            h('animate', {
              attributeName: 'dx',
              values: '0; 0.1; 0; 0.1; 0.2',
              keyTimes: '0; 0.3; 0.33; 0.7; 0.75',
              begin: '0s',
              dur: '3s',
              calcMode: 'discrete',
              repeatCount: 'indefinite',
              fill: 'freeze'
            })
          ),
          h('feOffset', {
            in: 'blended',
            dx: '0',
            dy: '0',
            y: '52%',
            height: '12%',
            result: 'slice5'
          }),
          h(
            'feOffset',
            {
              in: 'blended',
              dx: '0',
              dy: '0',
              y: '64%',
              height: '3%',
              result: 'slice6'
            },
            h('animate', {
              attributeName: 'dx',
              values: '0; -0.05; 0; -0.01; -0.15; -0.1; -0.15; -0.1; -0.15',
              keyTimes: '0; 0.3; 0.33; 0.8; 0.82; 0.84; 0.86; 0.88; 0.9',
              begin: '0s',
              dur: '3s',
              calcMode: 'discrete',
              repeatCount: 'indefinite',
              fill: 'freeze'
            })
          ),
          h('feOffset', {
            in: 'blended',
            dx: '0',
            dy: '0',
            y: '67%',
            height: '33%',
            result: 'slice7'
          }),
          h(
            'feMerge',
            {},
            h('feMergeNode', { in: 'slice1' }),
            h('feMergeNode', { in: 'slice2' }),
            h('feMergeNode', { in: 'slice3' }),
            h('feMergeNode', { in: 'slice4' }),
            h('feMergeNode', { in: 'slice5' }),
            h('feMergeNode', { in: 'slice6' }),
            h('feMergeNode', { in: 'slice7' })
          )
        )
      )
    )
  )

  return element
}
