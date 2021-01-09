const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");
const pkg = require("./package.json");
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV !== "production";
const shouldProfile = process.env.PROFILE === "true";

module.exports = {
  entry: "./src/index.ts",
  externals: [nodeExternals()],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
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
    publicPath: "/dist/",
    umdNamedDefine: true,
  },
  plugins: [
    shouldProfile && new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "src/**/*.(auth|graphql)",
          to: ".",
        },
      ],
    }),
  ].filter(Boolean),
  resolve: {
    extensions: ["*", ".js", ".ts"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  target: "node",
};
