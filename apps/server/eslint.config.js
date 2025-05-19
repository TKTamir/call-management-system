import baseConfig from "../../eslint.config.js";
import nodePlugin from "eslint-plugin-node";

export default [
  ...baseConfig,
  {
    plugins: {
      node: nodePlugin,
    },
    rules: {
      "node/no-missing-import": "error",
    },
  },
];
