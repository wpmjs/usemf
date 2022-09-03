const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")

module.exports = {
  entry: `./src/index.js`,
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.json'],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: `./index.js`,
    chunkFilename: "[name]-[chunkhash].js",
    libraryTarget: "umd",
    library: "mfjs"
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(process.cwd(), "babel.config.js"),
              babelrc: false
            }
          }
        ]
      },
    ]
  },
  plugins: [
  ]
};
