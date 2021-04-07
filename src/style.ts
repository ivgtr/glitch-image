export default function (
  className: string,
  attributes: { [attr: string]: string },
  ...children: string[]
): string {
  const camelToKebab = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

  const attrs = Object.entries(attributes).reduce(
    (acc, [k, v]) => `${acc} ${camelToKebab(k)}: ${v};\n`,
    ''
  )

  const close = `${children.join('')}`

  return `${className} {\n${attrs}${close}}\n`
}
