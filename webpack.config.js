var webpack = require("webpack");
var path = require("path");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
const secrets = require("./secrets");
require("image-webpack-loader");

module.exports = {
  entry: [
    "@babel/polyfill", // enables async-await
    "react", // Include this to enforce order
    "react-dom",
    "./client/index.js"
  ],
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
  },
  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "client"),
          path.resolve(__dirname, "node_modules/annotator"),
          path.resolve(__dirname, "node_modules/get-urls"),
          path.resolve(__dirname, "node_modules/jsontokens"),
          path.resolve(__dirname, "node_modules/uport"),
          path.resolve(__dirname, "node_modules/base64url"),
          path.resolve(__dirname, "node_modules/@react-schema-form")
        ],
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: [
              "@babel/preset-react",
              [
                "@babel/preset-env",
                {
                  targets: {
                    ie: "9"
                  },
                  useBuiltIns: "entry"
                }
              ]
            ],
            plugins: [
              "react-loadable/babel",
              "@babel/plugin-proposal-class-properties",
              [
                "@babel/plugin-syntax-dynamic-import",
                {},
                "plugin-syntax-dynamic-import-1"
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.less$/,
        use: ["less-loader"]
      },
      {
        test: /\.svg$|\.ttf?|\.woff$|\.woff2|\.eof|\.eot|\.png|\.jpg|\.gif/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  // When we're in development, we can use this handy live-reload plugin
  // to refresh the page for us every time we make a change to our client-side
  // files. It's like `nodemon` for the front end!
  plugins: isDev
    ? [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
          Tether: "tether",
          Popper: ["popper.js", "default"]
        }),
        new LiveReloadPlugin({ appendScriptTag: true }),
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify("development"),
            UPORT_CLIENT_PRIVATE_KEY: JSON.stringify(
              process.env.UPORT_CLIENT_PRIVATE_KEY
            ),
            UPORT_CLIENT_ADDRESS: JSON.stringify(
              process.env.UPORT_CLIENT_ADDRESS
            )
          }
        }),
        new HardSourceWebpackPlugin(),
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require("./public/build/library/library.json")
        })
      ]
    : [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
          tether: "tether",
          Tether: "tether",
          "window.Tether": "tether",
          Popper: ["popper.js", "default"]
        }),
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify("production"),
            UPORT_CLIENT_PRIVATE_KEY: JSON.stringify(
              process.env.UPORT_CLIENT_PRIVATE_KEY
            ),
            UPORT_CLIENT_ADDRESS: JSON.stringify(
              process.env.UPORT_CLIENT_ADDRESS
            )
          }
        })
      ]
};
