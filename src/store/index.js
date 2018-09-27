import Vue from 'vue';
import Vuex from 'vuex';

import cache from './plugins/cache';
import sync from './plugins/sync';

import feed from './feed';
import ui from './ui';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    initialized: false,
  },
  mutations: {
    loadFromCache(state, cached) {
      if (cached) {
        Object.keys(cached).forEach((key) => {
          state[key] = Object.assign({}, state[key], cached[key]);
        });
      }

      state.initialized = true;
    },
  },
  plugins: [cache, sync],
  modules: { feed, ui, user },
});

