import { applyTheme } from '../common/theme';

const initialState = () => ({
  theme: 'darcula',
  insaneMode: true,
});

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

    setTheme(state, theme) {
      state.theme = theme;
    },

    setInsaneMode(state, value) {
      state.insaneMode = value;
    },
  },
  actions: {
    setTheme({ commit }, theme) {
      applyTheme(theme);
      return commit('setTheme', theme);
    },
  },
};
