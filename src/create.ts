import axios from 'axios'
import imageSize from 'image-size'
import { query } from './@types/Query'
import h from './tag'

export const createImageElement = async ({ url }: query) => {
  const { buffer, ofset } = await axios
    .get(url as string, { responseType: 'arraybuffer' })
    .then((response) => ({
      buffer: Buffer.from(response.data, 'binary').toString('base64'),
      ofset: imageSize(response.data)
    }))

  // const resize = (n: string) => {
  //   const value = Number(n) - 20
  //   const ofset = value / 2

  //   return { value, ofset }
  // }

  // const type = 'square'

  // const mask = h(
  //   'mask',
  //   {
  //     id: 'mask'
  //   },
  //   h('circle', { cx: '50%', cy: '50%', r: '45%', fill: '#fff' })
  // )

  return {
    content: h('image', {
      href: `data:image/jpeg;base64,${buffer}`,
      filter: 'url(#glitch)',
      x: '5%',
      y: '5%',
      height: '90%',
      width: '90%',
      mask: 'url(#mask)'
    }),
    ofset_w: ofset.width as number,
    ofset_h: ofset.height as number
  }
}

export const createTextElement = ({ text, fontSize }: query) => {
  const text_length = text?.length as number
  const ofset_h = Number(fontSize)
  const ofset_w = text_length * ofset_h

  return {
    content: h(
      'text',
      {
        class: 'text-centered',
        filter: 'url(#glitch)',
        x: '50%',
        y: '50%'
      },
      text as string
    ),
    ofset_w,
    ofset_h
  }
}
