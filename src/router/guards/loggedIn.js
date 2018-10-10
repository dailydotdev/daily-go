import router from '../';
import store from '../../store';

export default function (to, from, next) {
  if (!store.getters['user/isLoggedIn']) {
    const url = to.path !== '/' ? `?from=${to.path}` : '';
    router.replace(`/login${url}`);
  }
  if (store.getters['user/isTokenAboutToExpire']) {
    store.dispatch('user/refreshToken')
      .then(() => next());
  } else {
    next();
  }
}
