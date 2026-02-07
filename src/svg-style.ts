import style from './style'

interface SvgStyleOptions {
  fontSize: number
  color: string
  darkColor: string
}

export function createSvgStyles({ fontSize, color, darkColor }: SvgStyleOptions): string {
  return [
    style('.text-centered', {
      font: `bold ${fontSize}px 'Source Code Pro', 'consolas', 'Menlo', 'Courier'`,
      fill: `#${color}`,
      dominantBaseline: 'middle',
      textAnchor: 'middle'
    }),
    style(
      '@media (prefers-color-scheme: dark)',
      {},
      style('.text-centered', {
        fill: `#${darkColor}`
      })
    )
  ].join('')
}
