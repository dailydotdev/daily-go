import cache from './plugins/cache';

export const plugins = [cache];

export const state = () => ({
  initialized: false,
});

export const mutations = {
  loadFromCache(state, cached) {
    if (cached) {
      Object.keys(cached).forEach(key => {
        state[key] = cached[key];
      });
    }

    state.initialized = true;
  },
};
