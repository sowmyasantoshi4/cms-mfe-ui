const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");

const deps = require("./package.json").dependencies;

const printCompilationMessage = require("./compilation.config.js");

module.exports = (_, argv) => {
  // console.log("argv.mode",argv.mode);
  // default => local | development
  let _PUBLIC_PATH = "http://localhost:9000/";

  // let _SHELL_MFE_URL = "http://localhost:9000/remoteEntry.js";
  let _LOGIN_MFE_URL = "http://localhost:9002/remoteEntry.js";
  let _TRACKING_MFE_URL = "http://localhost:9003/remoteEntry.js";
  let _REPORTS_MFE_URL = "http://localhost:9004/remoteEntry.js"
  let _ADMIN_MFE_URL = "http://localhost:9005/remoteEntry.js"
  let _PACKAGES_MFE_URL = "http://localhost:9006/remoteEntry.js";

  // for production
  // if( argv.mode === 'production'){
    _PUBLIC_PATH = process.env.SHELL_PUBLIC_PATH || "http://localhost:80/";

    // _SHELL_MFE_URL = process.env.SHELL_MFE_URL || "http://shell-service/remoteEntry.js";
    _LOGIN_MFE_URL = process.env.LOGIN_MFE_URL || "http://localhost:8081/remoteEntry.js";
    _TRACKING_MFE_URL = process.env.TRACKING_MFE_URL || "http://tracking-service/remoteEntry.js";
    _REPORTS_MFE_URL = process.env.REPORTS_MFE_URL || "http://reports-service/remoteEntry.js";
    _ADMIN_MFE_URL = process.env.ADMIN_MFE_URL || "http://admin-service/remoteEntry.js";
    _PACKAGES_MFE_URL = process.env.PACKAGES_MFE_URL || "http://packages-service/remoteEntry.js";

  // }

  // console.log("_PUBLIC_PATH",_PUBLIC_PATH)

  return {
  output: {
    // publicPath: argv.mode === 'development' ? "http://localhost:9000/" : "/"
    publicPath: _PUBLIC_PATH
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
    new Dotenv(),
    new ModuleFederationPlugin({
      name: "shell",
      filename: "remoteEntry.js",
      remotes: {
        // loginMFE: "login@http://localhost:9002/remoteEntry.js",
        // trackingMFE: "tracking@http://localhost:9003/remoteEntry.js",
        // reportsMFE: "reports@http://localhost:9004/remoteEntry.js",
        // adminMFE: "admin@http://localhost:9005/remoteEntry.js",
        // packagesMFE: "packages@http://localhost:9006/remoteEntry.js",

        loginMFE: `login@${_LOGIN_MFE_URL}`,
        trackingMFE: `tracking@${_TRACKING_MFE_URL}`,
        reportsMFE: `reports@${_REPORTS_MFE_URL}`,
        adminMFE: `admin@${_ADMIN_MFE_URL}`,
        packagesMFE: `packages@${_PACKAGES_MFE_URL}`,
     
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
    
  ],
  };
};