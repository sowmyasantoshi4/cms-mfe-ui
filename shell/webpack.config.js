const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const deps = require("./package.json").dependencies;

const printCompilationMessage = require('./compilation.config.js');

module.exports = (_, argv) => ({
  output: {
    // publicPath: "http://localhost:9000/",
    publicPath: "/shell/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 9000,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    onListening: function (devServer) {
      const port = devServer.server.address().port

      printCompilationMessage('compiling', port)

      devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage('failure', port)
          } else {
            printCompilationMessage('success', port)
          }
        })
      })
    }
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',    // Injects styles into DOM
          'css-loader',      // Translates CSS into CommonJS
          'sass-loader'      // Compiles Sass to CSS
        ]
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      filename: "remoteEntry.js",
      remotes: {
        // sharedMFE : 'shared@http://localhost:9001/remoteEntry.js',
        // loginMFE : 'login@http://localhost:9002/remoteEntry.js',
        // trackingMFE : 'tracking@http://localhost:9003/remoteEntry.js',
        // reportsMFE : 'reports@http://localhost:9004/remoteEntry.js',
        // adminMFE : 'admin_portal@http://localhost:9005/remoteEntry.js',
        // packagesMFE : 'packages@http://localhost:9006/remoteEntry.js',

        loginMFE: 'login@http://localhost:9000/login/remoteEntry.js',
        trackingMFE: 'tracking@http://localhost:9000/tracking/remoteEntry.js',
        reportsMFE: 'reports@http://localhost:9000/reports/remoteEntry.js',
        adminMFE: 'admin_portal@http://localhost:9000/admin/remoteEntry.js',
        packagesMFE: 'packages@http://localhost:9000/packages/remoteEntry.js',

      },
      exposes: {
        // Share the global state provider 
        './store': './src/globalState/store',  // Expose the Redux store to other MFEs
        './authSlice': './src/globalState/authSlice', // Expose the file
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
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps["@reduxjs/toolkit"] },
        'react-redux': { singleton: true, requiredVersion: deps["react-redux"] },
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
    new Dotenv()
  ],
});
