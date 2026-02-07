import type { ValidatedQuery } from './schema'
import { createImageElement, createTextElement } from './create'
import { createGlitchFilter } from './filter'
import { createSvgStyles } from './svg-style'
import tag from './tag'

const SVG_ID = 'glitch-image'

const DEFAULTS = {
  text: 'Glitch Image',
  color: '3f3f3f',
  darkColor: 'f3f3f3',
  fontSize: 10
} as const

export async function createElement({
  text,
  url,
  width,
  height,
  color = DEFAULTS.color,
  darkColor = DEFAULTS.darkColor,
  fontSize = DEFAULTS.fontSize
}: ValidatedQuery): Promise<string> {
  const resolvedText = text ?? DEFAULTS.text

  const {
    content,
    offsetWidth,
    offsetHeight
  } = url
    ? await createImageElement(url)
    : createTextElement(resolvedText, fontSize)

  const viewWidth = width ?? offsetWidth
  const viewHeight = height ?? offsetHeight

  return tag(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: `0 0 ${viewWidth} ${viewHeight}`,
      id: SVG_ID
    },
    tag('style', {}, createSvgStyles({ fontSize, color, darkColor })),
    tag(
      'svg',
      {
        width: viewWidth,
        height: viewHeight,
        x: 0,
        y: 0,
        class: 'box'
      },
      content
    ),
    tag('svg', { x: 0, y: 0 }, createGlitchFilter())
  )
}
