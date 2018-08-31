export const state = () => ({ insaneMode: true });

export const mutations = {
  setInsaneMode(state, value) {
    state.insaneMode = value;
  }
};
