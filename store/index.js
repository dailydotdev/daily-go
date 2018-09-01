import cache from './plugins/cache';
import sync from './plugins/sync';

export const plugins = [cache, sync];

export const state = () => ({
  initialized: false,
});

export const mutations = {
  loadFromCache(state, cached) {
    if (cached) {
      Object.keys(cached).forEach(key => {
        state[key] = Object.assign({}, state[key], cached[key]);
      });
    }

    state.initialized = true;
  },
};
