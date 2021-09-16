import { VercelRequestQuery } from "@vercel/node";

export type Options = {
  url?: string;
  text: string;
  color: string;
  darkColor: string;
  fontSize: string;
};

export type RequestQueryOptions = {
  url?: string;
  text?: string;
  color?: string;
  darkColor?: string;
  fontSize?: string;
};

export const parseRequest = (query: VercelRequestQuery & RequestQueryOptions) => {
  const {
    url,
    text = "Glitch Image",
    color = "3f3f3f",
    darkColor = "f3f3f3",
    fontSize = "10",
  } = query;

  return { url, text, color, darkColor, fontSize };
};
