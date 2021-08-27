const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: ["web", "es5"],
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
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
    }),
    new HtmlWebpackPlugin({
      title: "Play - SupaQuiz",
      template: "./src/quiz.html",
      filename: "quiz.html",
    }),
  ],
};
