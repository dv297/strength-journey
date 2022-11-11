module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
    presets: ["babel-preset-expo"],
  };
};
