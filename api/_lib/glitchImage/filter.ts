import h from "../utils/tag";

export const createFilter = () => {
  console.log("createFilter");

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
          x: "-10%",
          y: "0%",
          width: "120%",
          height: "100%",
        },
        h(
          "feColorMatrix",
          { in: "SourceGraphic", result: "red", type: "hueRotate", values: "180" },
          h("animate", {
            attributeName: "values",
            values: "0;360",
            dur: "3s",
            repeatCount: "indefinite",
          })
        )
      )
    )
  );
};
