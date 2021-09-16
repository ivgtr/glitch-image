import h from "../utils/tag";

export const createFilter = () => {
  console.log("createFilter");

  return h(
    "filter",
    {
      x: 0,
      y: 0,
    },
    h(
      "defs",
      {},
      h("filter", {
        id: "glitch",
        primitiveUnits: "objectBoundingBox",
        x: "-10%",
        y: "0%",
        width: "120%",
        height: "100%",
      })
    )
  );
};
