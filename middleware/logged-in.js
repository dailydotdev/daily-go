export default function ({ redirect, store }) {
  if (!store.getters['user/isLoggedIn']) {
    return redirect('/login');
  }

  if (store.getters['user/isTokenAboutToExpire']) {
    return store.dispatch('user/refreshToken');
  }

  return Promise.resolve();
};
