import axios from "axios";
import imageSize from "image-size";
import h from "../utils/tag";

export const createImageElement = async (url: string) => {
  const { buffer, info } = await axios
    .get(url, { responseType: "arraybuffer" })
    .then((response) => ({
      buffer: Buffer.from(response.data, "binary").toString("base64"),
      info: imageSize(response.data),
    }));

  return {
    contents: h("image", {
      href: `data:image/${info.type};base64,${buffer}`,
      x: "0",
      y: "0",
      height: "100%",
      width: "100%",
      filter: "url(#glitch)",
    }),
    ratio: { x: info.width, y: info.height },
  };
};

export const createTextImageElement = ({ text, fontSize }: { text: string; fontSize: string }) => {
  const text_length = text.length;
  const ratio_y = Number(fontSize);
  const ratio_x = text_length * ratio_y;

  return {
    contents: h(
      "text",
      {
        class: "text-centered",
        filter: "url(#glitch)",
        x: "50%",
        y: "50%",
      },
      text as string
    ),
    ratio: { x: ratio_x, y: ratio_y },
  };
};
