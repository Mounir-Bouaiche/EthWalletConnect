webpack = require("webpack")

module.exports = function override(config, env) {
  console.log("React app rewired works!");

  config.resolve.fallback = {
    stream: require.resolve("stream-browserify/"),
    assert: require.resolve("assert/"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    buffer: require.resolve('buffer'),
  };
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  return config;
};