import axios from 'axios'
import { imageSize } from 'image-size'
import tag from './tag'

export interface ElementResult {
  content: string
  offsetWidth: number
  offsetHeight: number
}

function escapeTextContent(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function createImageElement(url: string): Promise<ElementResult> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 10000,
    maxContentLength: 10 * 1024 * 1024,
    maxRedirects: 3
  })

  const buffer = Buffer.from(response.data, 'binary').toString('base64')
  const dimensions = imageSize(new Uint8Array(response.data))

  return {
    content: tag('image', {
      href: `data:image/jpeg;base64,${buffer}`,
      filter: 'url(#glitch)',
      x: '5%',
      y: '5%',
      height: '90%',
      width: '90%'
    }),
    offsetWidth: dimensions.width ?? 300,
    offsetHeight: dimensions.height ?? 300
  }
}

export function createTextElement(text: string, fontSize: number): ElementResult {
  const offsetHeight = fontSize
  const offsetWidth = text.length * offsetHeight

  return {
    content: tag(
      'text',
      {
        class: 'text-centered',
        filter: 'url(#glitch)',
        x: '50%',
        y: '50%'
      },
      escapeTextContent(text)
    ),
    offsetWidth,
    offsetHeight
  }
}
