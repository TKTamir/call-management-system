import baseConfig from "../../eslint.config.js";
import nodePlugin from "eslint-plugin-node";

export default [
  ...baseConfig,
  {
    plugins: {
      node: nodePlugin,
    },
  },
];
