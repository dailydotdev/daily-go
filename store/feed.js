import { fetchPublications } from '../services/api';

export const state = () => ({
  publications: [],
});

export const mutations = {
  setPublications(state, pubs) {
    state.publications = pubs;
  },
};

export const actions = {
  fetchPublications({ state, commit }) {
    return fetchPublications()
      .then(pubs => commit('setPublications', pubs));
  },
};
