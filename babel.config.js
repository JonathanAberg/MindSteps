module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './components',
            '@screens': './screens',
            '@assets': './assets',
            '@utils': './utils',
            '@hooks': './hooks',
            '@navigation': './navigation',
            '@store': './store',
            '@services': './services',
            '@types': './types',
            '@': './', // general alias for src
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
    ],
  };
};
