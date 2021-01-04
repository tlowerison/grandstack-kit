// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const reactRefresh = require("react-refresh/babel");
const path = require("path");
const pkg = require("./package.json");
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV !== "production";

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
  devtool: "source-map",
  entry: "./src/index.tsx",
  mode: isDevelopment ? "development" : "production",
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
    // new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/@tlowerison/react-d3-graph/dist/jq.wasm.wasm",
          to: ".",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve("./public/index.html"),
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  target: "web",
};
