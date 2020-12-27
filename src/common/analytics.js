import '../common/rIC';
import { fetchUser } from './api';

/* eslint-disable */
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();

  requestIdleCallback(() => {
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  });
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
/* eslint-enable */

ga('create', process.env.VUE_APP_GA, 'auto');

const isPwa = window.location.search.indexOf('pwa=true') > -1;

export const trackPage = (page) => {
  const suffix = isPwa ? '?pwa=true' : '';
  ga('set', 'page', `/go/${page}${suffix}`);
  ga('send', 'pageview');
};

export const updateId = (id) => {
  ga('set', 'userId', id);
};

export const init = (userId) => {
  const promise = userId ? Promise.resolve(userId) : fetchUser().then(user => user.id);
  promise.then(updateId);
};
