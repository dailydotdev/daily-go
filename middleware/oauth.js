import mixpanel from 'mixpanel-browser';
import { exchangeCode } from '../services/login';
import { updateId } from '../services/analytics';

export default function ({ params, query, redirect, store }) {
  return exchangeCode(params.provider, query)
    .then((profile) => {
      ga('send', 'event', 'Login', 'Done', params.provider);
      mixpanel.track('Login Done', { provider: params.provider, newUser: profile.newUser });

      updateId(profile.id);
      store.commit('user/updateProfile', profile);
      return redirect('/');
    })
    .catch(() => {
      ga('send', 'event', 'Login', 'Failed', params.provider);
      mixpanel.track('Login Failed', { provider: params.provider });

      redirect('/login');
    });
};
