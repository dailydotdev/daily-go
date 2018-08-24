const pkg = require('./package');

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Daily',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: [
    '~assets/global.css',
  ],

  /*
  ** Router config
  */
  router: {
    middleware: 'load-state',
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/external.js',
    '~/plugins/filters.js',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
  ],

  env: {
    GA: process.env.GA,
    MIXPANEL: process.env.MIXPANEL,
    API_URL: process.env.API_URL,
    BRANCH: process.env.BRANCH,
    VERSION: pkg.version,
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }

      config.module.rules.push({
        test: /\.css$/,
        use: [
          { loader: 'postcss-loader', options: {} }
        ]
      });
    }
  }
};
