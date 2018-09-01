import { getState } from '../services/storage';
import { applyTheme } from '../services/theme';

export default function ({ store }) {
  if (store.initialized) {
    return Promise.resolve();
  }

  return getState()
    .then(state => {
      store.commit('loadFromCache', state);
      applyTheme(store.state.ui.theme);
    });
};
