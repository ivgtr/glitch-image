import h from "../utils/tag";

const MAX_GLITCH_COUNT = 7;
const MAX_GLITCH_SEQUENCE_COUNT = 5;
const MAX_GLITCH_FREQUENCY_MS = 2000;

export const createFilter = () => {
  const glitchCount = Math.floor(Math.random() * MAX_GLITCH_COUNT) + 1;
  const glitchSequenceCount = Math.floor(Math.random() * MAX_GLITCH_SEQUENCE_COUNT) + 1;
  const glitchTop: number[] = [];
  const glitchHeight: number[] = [];

  for (let i = 0; i < glitchCount; i++) {
    glitchTop[i] = i === 0 ? 0 : (100 / glitchCount) * i;
  }

  return h(
    "svg",
    {
      x: 0,
      y: 0,
    },
    h(
      "defs",
      {},
      h(
        "filter",
        {
          id: "glitch",
          primitiveUnits: "objectBoundingBox",
          x: "-20%",
          y: "0%",
          width: "140%",
          height: "100%",
        },
        ...[...Array(glitchCount)].map((_, i) => {
          const time = Math.floor(Math.random() * 200 - 100) / 100;

          return h(
            "feOffset",
            {
              in: "SourceGraphic",
              dx: "0",
              dy: "0",
              y: `${glitchTop[i]}%`,
              height: `${100 / glitchCount}%`,
              result: `offset${i + 1}`,
            },
            h("animate", {
              attributeName: "dx",
              values: `0; ${Math.floor(Math.random() * 200 - 100) / 100}; 0; ${time}; ${time}`,
              keyTimes: "0; 0.3; 0.33; 0.7; 0.75",
              begin: "0s",
              dur: "3s",
              calcMode: "discrete",
              repeatCount: "indefinite",
              fill: "freeze",
            })
          );
        }),
        h(
          "feMerge",
          {},
          ...[...Array(glitchCount)].map((_, i) =>
            h("feMergeNode", {
              in: `offset${i + 1}`,
            })
          )
        )
      )
    )
  );
};
