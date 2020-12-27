import { apiUrl } from './config';

export const getLoginLink = (provider, redirectTo) =>
  `${apiUrl}/v1/auth/authorize?provider=${provider}&redirect_uri=${encodeURI(window.location.origin + redirectTo)}&skip_authenticate=true`;

export const exchangeCode = (provider, query) =>
  fetch(`${apiUrl}/v1/auth/${provider}/authenticate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(query),
    credentials: 'include',
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error('Login failed');
    }
    return res.json();
  });
