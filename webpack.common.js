const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
  target: ["web", "es5"],
  entry: {
    app: "./src/app.js",
    home: "./src/home.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "SupaQuiz",
      template: "./src/index.html",
      filename: "index.html",
      excludeChunks: ["app"],
    }),
    new HtmlWebpackPlugin({
      title: "Play - SupaQuiz",
      template: "./src/quiz.html",
      filename: "quiz.html",
      excludeChunks: ["home"],
    }),
    new PreloadWebpackPlugin({
      rel: "preload",
      as(entry) {
        if (/\.(woff|woff2|ttf|otf)$/.test(entry)) {
          return "font";
        }

        if (/\.css$/.test(entry)) {
          return "style";
        }

        if (/\.(png|jpg|jpeg)$/.test(entry)) {
          return "image";
        }

        return "script";
      },
      fileWhitelist: [/\.(woff|woff2|ttf|otf)$/],
      include: "allAssets",
    }),
  ],
};
