module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  pwa: {
    name: 'Daily',
    themeColor: '#393C3E',
    msTileColor: '#393C3E',
    iconPaths: {
      favicon32: 'img/icons/icon-32x32.png',
      favicon16: 'img/icons/icon-16x16.png',
      appleTouchIcon: 'img/icons/icon-152x152.png',
      msTileImage: 'img/icons/icon-144x144.png',
    },
    workboxOptions: {
      exclude: [/_redirects$/],
      runtimeCaching: [
        {
          // eslint-disable-next-line no-useless-escape
          urlPattern: new RegExp('^https:\/\/(storage\.googleapis\.com\/devkit-assets\/images|res\.cloudinary\.com\/daily-now\/image\/upload\/.*\/v1\/posts)\/.*'),
          method: 'GET',
          handler: 'cacheFirst',
          options: {
            cacheName: 'post-images',
            expiration: {
              // 7 days
              maxAgeSeconds: 604800,
            },
          },
        },
        {
          // eslint-disable-next-line no-useless-escape
          urlPattern: new RegExp('^https:\/\/(storage\.googleapis\.com\/devkit-assets\/ads|res\.cloudinary\.com\/daily-now\/image\/upload\/.*\/v1\/ads)\/.*'),
          method: 'GET',
          handler: 'cacheFirst',
          options: {
            cacheName: 'ads-images',
            expiration: {
              // 7 days
              maxAgeSeconds: 604800,
            },
          },
        },
        {
          // eslint-disable-next-line no-useless-escape
          urlPattern: new RegExp('^https:\/\/res\.cloudinary\.com\/daily-now\/image\/upload\/.*\/v1\/logos\/.*'),
          method: 'GET',
          handler: 'cacheFirst',
          options: {
            cacheName: 'pubs-logos',
          },
        },
        {
          urlPattern: 'https://www.google-analytics.com/analytics.js',
          handler: 'cacheFirst',
        },
        {
          urlPattern: 'https://ajax.googleapis.com/ajax/libs/webfont/*',
          method: 'GET',
          handler: 'cacheFirst',
        },
        {
          urlPattern: 'https://storage.googleapis.com/devkit-assets/static/*',
          method: 'GET',
          handler: 'cacheFirst',
        },
        {
          // eslint-disable-next-line
          urlPattern: new RegExp('^/\.*'),
          method: 'GET',
          handler: 'networkFirst',
        },
      ],
    },
  },
};
