const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");

const deps = require("./package.json").dependencies;

const printCompilationMessage = require("./compilation.config.js");

module.exports = (_, argv) => {
  return {
  output: {
    publicPath: argv.mode === 'development' ? "http://localhost:9000/" : "/"
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 9000,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src/components"), path.resolve(__dirname, "src/pages")],
    onListening: function (devServer) {
      const port = devServer.server.address().port;

      printCompilationMessage("compiling", port);

      devServer.compiler.hooks.done.tap("OutputMessagePlugin", (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage("failure", port);
          } else {
            printCompilationMessage("success", port);
          }
        });
      });
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          "style-loader", // Injects styles into DOM
          "css-loader", // Translates CSS into CommonJS
          "postcss-loader", // Processes CSS with PostCSS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
      },
            {
              test: /\.(ts|tsx|js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                },
              },
            },
          ],
        },

  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      filename: "remoteEntry.js",
      remotes: {
        loginMFE: "login@http://localhost:9002/remoteEntry.js",
        trackingMFE: "tracking@http://localhost:9003/remoteEntry.js",
        reportsMFE: "reports@http://localhost:9004/remoteEntry.js",
        adminMFE: "admin@http://localhost:9005/remoteEntry.js",
        packagesMFE: "packages@http://localhost:9006/remoteEntry.js",
      },
      exposes: {
        // Share the global state provider
        "./store": "./src/globalState/store", // Expose the Redux store to other MFEs
        "./authSlice": "./src/globalState/authSlice", // Expose the file
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "@reduxjs/toolkit": {
          singleton: true,
          requiredVersion: deps["@reduxjs/toolkit"],
        },
        "react-redux": {
          singleton: true,
          requiredVersion: deps["react-redux"],
        },
        // // Share the global state provider and hook
        // 'shared-components': {
        //   singleton: true,
        //   requiredVersion: 'auto', // Adjust based on your package version
        // },
        },
      }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv(),
  ],
  };
};