import { refreshToken, logout } from '../services/api';

export const state = () => ({ profile: null });

export const mutations = {
  updateProfile(state, profile) {
    const newProfile = Object.assign({}, profile);
    if (newProfile.newUser) {
      // TODO: need to set something temporary when this is a new user
      delete newProfile.newUser;
    }

    state.profile = newProfile;
  },

  refreshToken(state, newToken) {
    state.profile = Object.assign({}, state.profile, newToken);
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
