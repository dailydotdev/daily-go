import { apiUrl } from './config';

export const getLoginLink = (provider, redirectTo) => {
  const suffix = redirectTo ? `?to=${redirectTo}` : '';
  const redirectUri = `${window.location.origin}/oauth/${provider}/callback${suffix}`;
  return `${apiUrl}/v1/auth/${provider}/authorize?redirect_uri=${encodeURI(redirectUri)}`;
};

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
