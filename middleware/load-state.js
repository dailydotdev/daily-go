import { getState } from '../services/storage';

export default function ({ store }) {
  if (store.initialized) {
    return Promise.resolve();
  }

  return getState()
    .then(state => store.commit('loadFromCache', state));
};
