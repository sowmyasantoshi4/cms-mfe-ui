const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const deps = require("./package.json").dependencies;

const printCompilationMessage = require('./compilation.config.js');

module.exports = (_, argv) => {
  // console.log("argv.mode",argv.mode);
  // default => local | development
  let _PUBLIC_PATH = "http://localhost:9005/";

  let _SHELL_MFE_URL = "http://localhost:9000/remoteEntry.js";
  let _LOGIN_MFE_URL = "http://localhost:9002/remoteEntry.js";
  let _TRACKING_MFE_URL = "http://localhost:9003/remoteEntry.js";
  let _REPORTS_MFE_URL = "http://localhost:9004/remoteEntry.js"
  let _ADMIN_MFE_URL = "http://localhost:9005/remoteEntry.js"
  let _PACKAGES_MFE_URL = "http://localhost:9006/remoteEntry.js";

  // for production
  if( argv.mode === 'production'){
    _PUBLIC_PATH = process.env.ADMIN_PUBLIC_PATH || "http://admin-service/";
    _SHELL_MFE_URL = process.env.SHELL_MFE_URL || "http://shell-service/remoteEntry.js";
  }
  return {
  output: {
    publicPath: _PUBLIC_PATH,
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 9005,
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
      name: "admin",
      filename: "remoteEntry.js",
      remotes: {
        shell: `shell@${_SHELL_MFE_URL}`,
      },
      exposes: {
        './AddBranch': './src/components/branch/AddBranch',
        './AddStaff': './src/components/staff/AddStaff'
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
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv()
  ],
}
};
