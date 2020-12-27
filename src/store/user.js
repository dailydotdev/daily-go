import { logout, fetchUser } from '../common/api';
import { deleteState } from '../common/storage';

const initialState = () => ({ profile: null });

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    reset(state) {
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
    },

    updateProfile(state, profile) {
      state.profile = profile;
    },

    refreshToken(state, newToken) {
      state.profile = Object.assign({}, state.profile, newToken);
    },

    notNewUser(state) {
      state.profile.newUser = false;
    },
  },
  actions: {
    refreshToken({ commit }) {
      return fetchUser()
        .then((user) => {
          if ('providers' in user) {
            const userClone = Object.assign({}, user);
            userClone.accessToken = undefined;
            commit('updateProfile', userClone);
          } else {
            commit('updateProfile', null);
          }
        });
    },
    logout({ commit }) {
      commit('reset');
      commit('ui/reset', null, { root: true });
      commit('feed/reset', null, { root: true });
      return Promise.all([
        logout(),
        deleteState(),
      ]);
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.profile && !!state.profile.id;
    },
  },
};
