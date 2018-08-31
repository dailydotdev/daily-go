import { exchangeCode } from '../services/login';

export default function ({ params, query, redirect, store }) {
  return exchangeCode(params.provider, query)
    .then((profile) => {
      store.commit('user/updateProfile', profile);
      return redirect('/');
    })
    .catch(() => redirect('/login'));
};
