import { apiUrl } from './config';

export const refreshToken = token =>
  fetch(`${apiUrl}/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: token }),
    credentials: 'include',
  })
    .then(response => response.json());

export const fetchPublications = () =>
  fetch(`${apiUrl}/v1/publications`, { credentials: 'include' })
    .then(response => response.json());

export const logout = () =>
  fetch(`${apiUrl}/v1/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });
