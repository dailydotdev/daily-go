import { refreshToken, logout } from '../services/api';

export const state = () => ({ profile: null });

export const mutations = {
  updateProfile(state, profile) {
    state.profile = profile;
  },

  refreshToken(state, newToken) {
    state.profile = Object.assign({}, state.profile, newToken);
  },

  notNewUser(state) {
    state.profile.newUser = false;
  },
};

export const actions = {
  refreshToken({ state, commit }) {
    return refreshToken(state.profile.refreshToken)
      .then((accessToken) =>
        commit('refreshToken', { accessToken: accessToken.token, expiresIn: accessToken.expiresIn }));
  },
  logout({ state, commit }) {
    commit('updateProfile', {});
    // TODO: delete cache
    return logout();
  }
};

export const getters = {
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
};
