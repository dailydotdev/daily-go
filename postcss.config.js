module.exports = {
  plugins: {
    'postcss-extend': {},
    'postcss-preset-env': {
      stage: 1,
      browsers: ['last 2 versions', '> 5%'],
      features: {
        'nesting-rules': true,
        'custom-media-queries': {
          extensions: {
            '--mobile-m': '(min-width: 375px)',
          },
        },
      },
    },
  },
};
