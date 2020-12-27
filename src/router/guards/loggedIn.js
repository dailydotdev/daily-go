import router from '../';
import store from '../../store';

export default function (to, from, next) {
  store.dispatch('user/refreshToken')
    .then(() => {
      if (!store.getters['user/isLoggedIn']) {
        const url = to.path !== '/' ? `?from=${to.path}` : '';
        router.replace(`/login${url}`);
      } else {
        next();
      }
    });
}
