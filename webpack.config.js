// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "dashboard-bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    library: {
      name: "ReactDashboard",
      type: "umd",
      export: "default",
    },
    // This helps with UMD compatibility
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "reactDashboard",
      filename: "remoteEntry.js",
      exposes: {
        "./Dashboard": "./src/components/Dashboard",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
    // HtmlWebpackPlugin for development/testing
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: true,
      // Add React and ReactDOM scripts for development
      scripts: [
        "https://unpkg.com/react@18/umd/react.development.js",
        "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  // Modified externals configuration for better compatibility
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React",
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "ReactDOM",
    },
  },
};
