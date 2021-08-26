const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    watchFiles: "./src/**/*.{html,css,js}",
  },
  module: {
    rules: [
      // CSS loaders
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, "src/styles"),
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
});
