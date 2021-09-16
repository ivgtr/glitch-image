import type { Options } from "../perser";
import h from "../utils/tag";
import { createImageElement, createTextImageElement } from "./create";
import { createFilter } from "./filter";

const svgID = "glitch-image";

export const glitchImage = async ({ url, text, fontSize }: Options) => {
  const { contents, ratio } = url
    ? await createImageElement(url)
    : createTextImageElement({ text, fontSize });

  const mask = createFilter();

  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${ratio.x || 1} ${ratio.y || 1}`,
      id: svgID,
    },
    h(
      "svg",
      {
        width: ratio.x || 1,
        height: ratio.y || 1,
        x: 0,
        y: 0,
        class: "box",
      },
      contents,
      mask
    )
  );
};
