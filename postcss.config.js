module.exports = {
  plugins: {
    'postcss-extend': {},
    'postcss-preset-env': { stage: 3, features: { 'nesting-rules': true } },
  }
};
