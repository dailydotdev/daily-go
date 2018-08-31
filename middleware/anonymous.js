export default function ({ redirect, store }) {
  if (store.getters['user/isLoggedIn']) {
    redirect('/');
  }
};
