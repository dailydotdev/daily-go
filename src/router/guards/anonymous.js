import router from '../';
import store from '../../store';

export default function (to, from, next) {
  if (store.getters['user/isLoggedIn']) {
    router.replace('/');
  } else {
    next();
  }
}
