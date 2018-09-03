import mixpanel from 'mixpanel-browser';
import { fetchUserId } from './api';

const mixpanelTrack = mixpanel.track.bind(mixpanel);

const mixpanelQueue = [];
mixpanel.track = (...args) => {
  mixpanelQueue.push(args);
};

const isPwa = location.search.indexOf('pwa=true') > -1;

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
  mixpanel.init(process.env.MIXPANEL);
  mixpanel.register({
    source: 'app',
    pwa: isPwa,
  });

  const promise = userId ? Promise.resolve(userId) : fetchUserId();
  promise.then((id) => {
    updateId(id);
    mixpanelQueue.forEach(args => mixpanelTrack(...args));
    mixpanel.track = mixpanelTrack;
  });
};
