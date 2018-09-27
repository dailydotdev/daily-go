import router from '../';
import store from '../../store';

export default function (to, from, next) {
  if (!store.getters['user/isLoggedIn']) {
    router.replace('/login');
  }
  if (store.getters['user/isTokenAboutToExpire']) {
    store.dispatch('user/refreshToken')
      .then(() => next());
  } else {
    next();
  }
}
