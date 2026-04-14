const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_env, argv) => ({
  mode: 'production',
  target: 'web',
  entry: { renderer: './src/renderer/index.tsx' },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.renderer.json'
        },        
        include: [path.resolve(__dirname, 'src/renderer'), path.resolve(__dirname, 'src/shared')],
        exclude: [/node_modules/, /\.test\.tsx?$/],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 8080,
    allowedHosts: 'all',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: argv.mode === 'development' ? '/' : './',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxAssetSize: 300_000,
    maxEntrypointSize: 350_000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Update this path based on your HTML template location
    }),
  ],
});
