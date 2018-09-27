import 'mixpanel-browser/mixpanel-jslib-snippet.min';
import { fetchUserId } from './api';

/* eslint-disable */
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();

  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
/* eslint-enable */

ga('create', process.env.VUE_APP_GA, 'auto');

const isPwa = window.location.search.indexOf('pwa=true') > -1;

mixpanel.init(process.env.VUE_APP_MIXPANEL);
mixpanel.register({
  source: 'app',
  pwa: isPwa,
});

export const trackPage = (page) => {
  const suffix = isPwa ? '?pwa=true' : '';
  ga('set', 'page', `/app/${page}${suffix}`);
  ga('send', 'pageview');
  mixpanel.track(`App ${page.replace(/^\w/, c => c.toUpperCase())}`);
};

export const updateId = (id) => {
  ga('set', 'userId', id);
  mixpanel.identify(id);
};

export const init = (userId) => {
  const promise = userId ? Promise.resolve(userId) : fetchUserId();
  promise.then(updateId);
};
