const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const pkg = require("./package.json");
const reactRefresh = require("react-refresh/babel");
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV !== "production";
const shouldProfile = process.env.PROFILE === "true";

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 3000,
    proxy: {
      "/graphql": "http://localhost:8080",
    },
  },
  devtool: isDevelopment ? "source-map" : false,
  entry: "./src/index.tsx",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                isDevelopment && reactRefresh,
              ].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
    ],
    splitChunks: {
     chunks: "all",
    },
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    library: pkg.name,
    libraryTarget: "umd",
    publicPath: "./",
    umdNamedDefine: true,
  },
  plugins: [
    shouldProfile && new BundleAnalyzerPlugin(),
    new CompressionPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve("./public/index.html"),
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  target: "web",
};
