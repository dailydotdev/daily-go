const pkg = require('./package');

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Daily Now - Source for Busy Developers',
    meta: [
      {
        name: 'keyword',
        content: 'TEM, The Elegant Monkeys, Daily, Fullstack, Web, Technologies, Javascript, HTML, CSS, nodejs, rss, Chrome Extension, Firefox Addon'
      }
    ],
  },

  meta: {
    name: 'Daily Now',
    theme_color: '#393C3E',
    ogSiteName: 'Daily Now - Source for Busy Developers',
    ogTitle: 'Daily Now - Source for Busy Developers',
    ogImage: 'https://www.dailynow.co/cover.jpg',
    ogUrl: 'https://pwa.dailynow.co/',
    twitterCard: 'summary_large_image',
    twitterSite: '@dailynowco'
  },

  manifest: {
    name: 'Daily Now',
    short_name: 'Daily Now',
    description: 'We help devs focus on code instead of searching for news',
    background_color: '#4D96F1',
    theme_color: '#393C3E',
    start_url: '/?pwa=true',
  },

  workbox: {
    runtimeCaching: [
      {
        urlPattern: 'https://storage.googleapis.com/devkit-assets/images/*',
        handler: 'cacheFirst',
        strategyOptions: {
          cacheName: 'post-images',
          cacheExpiration: {
            maxEntries: 100,
          }
        },
      },
      {
        urlPattern: 'https://storage.googleapis.com/devkit-assets/logos/*',
        handler: 'cacheFirst',
        strategyOptions: {
          cacheName: 'publication-logos',
        },
      },
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  loadingIndicator: {
    name: 'three-bounce',
    color: '#848886',
    background: '#272727',
  },

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
