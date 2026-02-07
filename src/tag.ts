function escapeAttr(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const VOID_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'image',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source'
]

export default function tag(
  tagName: string,
  attributes: { [attr: string]: string | number },
  ...children: string[]
): string {
  const isVoidTag = VOID_TAGS.includes(tagName)

  const attrs = Object.entries(attributes).reduce(
    (acc, [k, v]) => `${acc} ${k}="${escapeAttr(v)}"`,
    ''
  )

  if (isVoidTag) {
    return `<${tagName}${attrs} />`
  }

  return `<${tagName}${attrs}>${children.join('')}</${tagName}>`
}
