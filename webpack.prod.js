const path = require("path");
const { ProgressPlugin } = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[fullhash].[id].js",
  },
  module: {
    rules: [
      // CSS loaders
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, "src/assets/scss"),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      // Babel loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
  },
});
