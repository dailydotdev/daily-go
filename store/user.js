import { refreshToken, logout } from '../services/api';
import { deleteState } from '../services/storage';

const initialState = { profile: null };

export const state = () => Object.assign({}, initialState);

export const mutations = {
  reset(state) {
    state = Object.assign({}, initialState);
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
};

export const actions = {
  refreshToken({ state, commit }) {
    return refreshToken(state.profile.refreshToken)
      .then((accessToken) =>
        commit('refreshToken', { accessToken: accessToken.token, expiresIn: accessToken.expiresIn }));
  },
  logout({ state, commit }) {
    commit('reset');
    commit('ui/reset', null, { root: true });
    commit('feed/reset', null, { root: true });
    return Promise.all([
      logout(),
      deleteState(),
    ]);
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
