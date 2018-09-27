import router from '../';
import store from '../../store';
import checkSupport from '../../common/support';
import { getState } from '../../common/storage';
import { init } from '../../common/analytics';
import { applyTheme } from '../../common/theme';

export default function (to, from, next) {
  if (to.name !== 'notSupported' && !checkSupport()) {
    return router.replace('/notSupported');
  }

  if (store.initialized) {
    return next();
  }

  return getState()
    .then((state) => {
      store.commit('loadFromCache', state);

      init(store.getters['user/isLoggedIn'] ? store.state.user.profile.id : null);

      applyTheme(store.state.ui.theme);
      next();
    });
}
