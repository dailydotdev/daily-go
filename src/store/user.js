import { refreshToken, logout } from '../common/api';
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
    refreshToken({ state, commit }) {
      return refreshToken(state.profile.refreshToken)
        .then(accessToken =>
          commit('refreshToken', { accessToken: accessToken.token, expiresIn: accessToken.expiresIn }));
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

    isTokenAboutToExpire(state) {
      if (state.profile && state.profile.expiresIn) {
        const dt = new Date(state.profile.expiresIn) - new Date();
        return dt <= 60 * 60 * 1000;
      }

      return false;
    },
  },
};
