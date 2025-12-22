module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
        // Required for reanimated (if used) and other features
        'react-native-reanimated/plugin',
    ],
  };
};
