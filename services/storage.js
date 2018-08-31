import localForage from 'localforage';
import { pageSize } from './config';

const store = localForage.createInstance({
  name: 'daily',
});

const truncToOnePage = posts => posts ? posts.slice(0, pageSize) : posts;

export const cacheState = state => {
  const keys = ['user', 'feed'];
  const opt = {
    user: {
      filter: [],
      transform: {},
    },
    feed: {
      filter: ['page', 'latest', 'loading'],
      transform: {
        bookmarks: truncToOnePage,
      }
    },
  };
  const cachedState = Object.keys(state)
    .filter(key => keys.indexOf(key) > -1)
    .reduce((res, cur) => {
      const toCache = Object.keys(state[cur])
        .filter(key => opt[cur].filter.indexOf(key) === -1)
        .reduce((cache, subKey) => {
          const value = opt[cur].transform[subKey] ? opt[cur].transform[subKey](state[cur][subKey]) : state[cur][subKey];
          return Object.assign({}, cache, { [subKey]: value });
        }, {});
      return Object.assign({}, res, { [cur]: toCache });
    }, {});
  return store.setItem('state', cachedState);
};

export const getState = () => store.getItem('state');

export const deleteState = () => store.removeItem('state');
