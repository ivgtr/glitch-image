import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async (
  req: VercelRequest & { query: { text?: string; url?: string } },
  res: VercelResponse
) => {
  const { text, url } = req.query

  const buf = await createImage(text, url)

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml'
  })
  res.end(buf)
}

const createImage = async (text?: string, url?: string): Promise<string> => {
  // const W = 1200
  // const H = 630

  const getImage = async () => {
    const buffer = await axios
      .get(url as string, { responseType: 'arraybuffer' })
      .then((response) => Buffer.from(response.data, 'binary').toString('base64'))

    return `<image
          href="data:image/jpeg;base64,${buffer}"
          filter="url(#glitch)"
          x="50"
          y="50"
          height="100"
          width="100"
        />`
  }

  const getText = () => `
    <text class="text-centered" filter="url(#glitch)" x="50%" y="50%">
      ${text}
    </text>
`

  const element = url ? await getImage() : getText()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 200 200">
    <style>
        .text-centered {
          font: bold 10px 'Source Code Pro', 'consolas', 'Menlo', 'Courier';
          fill: #3f3f3f;
          dominant-baseline: middle;
          text-anchor: middle;
        }
    </style>
    <svg height="200" width="200" class="box">
      ${element}
    </svg>

    <svg width="0" height="0">
      <defs>
        <filter
                id="glitch"
                primitiveUnits="objectBoundingBox"
                x="-10%"
                y="0%"
                width="120%"
                height="100%"
                >
          <feColorMatrix
                        in="SourceGraphic"
                        result="red"
                        type="matrix"
                        values="1 0 0 0 0
                                0 0 0 0 0
                                0 0 0 0 0
                                0 0 0 1 0"
                        />
          <!-- green: G成分 -->
          <feColorMatrix
                        in="SourceGraphic"
                        result="green"
                        type="matrix"
                        values="0 0 0 0 0
                                0 1 0 0 0
                                0 0 0 0 0
                                0 0 0 1 0"
                        />
          <!-- blue: B成分 -->
          <feColorMatrix
                        in="SourceGraphic"
                        result="blue"
                        type="matrix"
                        values="0 0 0 0 0
                                0 0 0 0 0
                                0 0 1 0 0
                                0 0 0 1 0"
                        />

          <!-- red-shifted: R成分を左にずらしたもの -->
          <feOffset in="red" result="red-shifted" dx="-0.005" dy="0">
            <animate
                    attributeName="dx"
                    values="0; -0.005; 0; -0.007; -0.007"
                    keyTimes="0; 0.3; 0.33; 0.7; 0.75"
                    begin="0s"
                    dur="3s"
                    calcMode="discrete"
                    repeatCount="indefinite"
                    fill="freeze"
                    />
          </feOffset>
          <!-- blue-shifted: B成分を右にずらしたもの -->
          <feOffset in="blue" result="blue-shifted" dx="0.005" dy="0">
            <animate
                    attributeName="dx"
                    values="0; 0.005; 0; 0.007; 0.007"
                    keyTimes="0; 0.3; 0.33; 0.7; 0.75"
                    begin="0s"
                    dur="3s"
                    calcMode="discrete"
                    repeatCount="indefinite"
                    fill="freeze"
                    />
          </feOffset>

          <!-- blended: ブレンド結果 -->
          <feBlend
                  mode="screen"
                  in="red-shifted"
                  in2="green"
                  result="red-green"
                  />
          <feBlend
                  mode="screen"
                  in="red-green"
                  in2="blue-shifted"
                  result="blended"
                  />

          <!-- スライスごとに横に動かす -->
          <feOffset
                    in="blended"
                    dx="0"
                    dy="0"
                    y="0%"
                    height="30%"
                    result="slice1"
                    ></feOffset>
          <feOffset
                    in="blended"
                    dx="0"
                    dy="0"
                    y="30%"
                    height="10%"
                    result="slice2"
                    >
            <animate
                    attributeName="dx"
                    values="0; -0.005; 0; -0.01"
                    keyTimes="0; 0.3; 0.33; 0.7"
                    begin="0s"
                    dur="3s"
                    calcMode="discrete"
                    repeatCount="indefinite"
                    fill="freeze"
                    />
          </feOffset>
          <feOffset
                    in="blended"
                    dx="0"
                    dy="0"
                    y="40%"
                    height="10%"
                    result="slice3"
                    ></feOffset>
          <feOffset
                    in="blended"
                    dx="0"
                    dy="0"
                    y="50%"
                    height="2%"
                    result="slice4"
                    >
            <animate
                    attributeName="dx"
                    values="0; 0.01; 0; 0.01; 0.02"
                    keyTimes="0; 0.3; 0.33; 0.7; 0.75"
                    begin="0s"
                    dur="3s"
                    calcMode="discrete"
                    repeatCount="indefinite"
                    fill="freeze"
                    />
          </feOffset>
          <feOffset
                    in="blended"
                    dx="0"
                    dy="0"
                    y="52%"
                    height="12%"
                    result="slice5"
                    ></feOffset>
          <feOffset
                    in="blended"
                    dx="0"
                    dy="0"
                    y="64%"
                    height="3%"
                    result="slice6"
                    >
            <animate
                    attributeName="dx"
                    values="0; -0.005; 0; -0.01; -0.015; -0.01; -0.015; -0.01; -0.015"
                    keyTimes="0; 0.3; 0.33; 0.8; 0.82; 0.84; 0.86; 0.88; 0.9"
                    begin="0s"
                    dur="3s"
                    calcMode="discrete"
                    repeatCount="indefinite"
                    fill="freeze"
                    />
          </feOffset>
          <feOffset
                    in="blended"
                    dx="0"
                    dy="0"
                    y="67%"
                    height="33%"
                    result="slice7"
                    ></feOffset>

          <!-- スライスをマージ -->
          <feMerge>
            <feMergeNode in="slice1" />
            <feMergeNode in="slice2" />
            <feMergeNode in="slice3" />
            <feMergeNode in="slice4" />
            <feMergeNode in="slice5" />
            <feMergeNode in="slice6" />
            <feMergeNode in="slice7" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </svg>`

  return svg
}
