import { applyTheme } from '../services/theme';

const initialState = {
  theme: 'darcula',
  insaneMode: true,
};

export const state = () => Object.assign({}, initialState);

export const mutations = {
  reset(state) {
    state = Object.assign({}, initialState);
  },

  setTheme(state, theme) {
    state.theme = theme;
  },

  setInsaneMode(state, value) {
    state.insaneMode = value;
  }
};

export const actions = {
  setTheme({ commit, state }, theme) {
    applyTheme(theme);
    return commit('setTheme', theme);
  },
};
