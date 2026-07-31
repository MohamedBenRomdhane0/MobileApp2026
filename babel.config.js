module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            '@': './src',
            '@utils': './src/utils',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@assets': './assets', 
          },
        },
      ],

    "react-native-reanimated/plugin",
    ],
  }
}

