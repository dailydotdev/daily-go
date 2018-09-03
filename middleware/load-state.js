import { getState } from '../services/storage';
import { applyTheme } from '../services/theme';
import { init } from '../services/analytics';

export default function ({ store }) {
  if (store.initialized) {
    return Promise.resolve();
  }

  return getState()
    .then(state => {
      store.commit('loadFromCache', state);

      init(store.getters['user/isLoggedIn'] ? store.state.user.profile.id : null);

      applyTheme(store.state.ui.theme);
    });
};
