const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: process.cwd(),
  resolve: {
    extensions: [".js", ".jsx", ".json", ".less", ".css"],
    modules: [__dirname, "node_modules"]
  },
  entry: {
    library: [
      "react",
      "react-accessible-accordion",
      "react-async-poll",
      "react-autobind",
      "react-avatar",
      "react-dom",
      "react-dropzone",
      "react-ga",
      "react-joyride",
      "react-loadable",
      "react-markdown",
      "react-markmirror",
      "react-microlink",
      "react-modal",
      "react-paginate",
      "react-pundit",
      "react-redux",
      "react-router",
      "react-scroll",
      "react-select",
      "react-table",
      "react-tooltip",
      "redux",
      "jquery",
      "axios",
      "bootstrap",
      "downloadjs",
      "draft-js",
      "loadable-components",
      "lodash",
      "moment",
      "styled-components",
      "uport-connect"
    ]
  },
  output: {
    filename: "library.dll.js",
    path: path.resolve(__dirname, "./public/build/library"),
    library: "library"
  },
  module: {
    rules : [
      {
        test : /\.jsx?$/,
        use : {
          loader : "babel-loader",
          options : {
            babelrc : false,
            presets : ["@babel/preset-react", [
              "@babel/preset-env",
              {
                "targets" : {
                  "ie" : "9"
                },
                "useBuiltIns" : "usage"
              }
            ]],
            plugins : ["react-loadable/babel", "syntax-dynamic-import", "@babel/plugin-proposal-class-properties"]
          }
        }
      },
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      name: "library",
      path: "./public/build/library/library.json"
    })
  ]
};
