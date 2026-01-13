module.exports = function (api) {
  api && api.cache && api.cache(true);
  return {
    presets: ['babel-preset-expo', require.resolve('nativewind/babel')],
    plugins: [],
  };
};
