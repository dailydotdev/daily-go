import { apiUrl, pageSize } from './config';

const redirectLink = post =>
  `${apiUrl}/r/${post.id}`;

const ratioToSize = (ratio) => {
  if (ratio > 1.5) {
    return 'small';
  }

  if (ratio <= 0.75) {
    return 'large';
  }

  return 'medium';
};

const mapPost = post =>
  Object.assign({}, post, {
    createdAt: new Date(post.createdAt),
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    url: redirectLink(post),
    size: ratioToSize(post.ratio),
  });

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

export const fetchLatestPosts = (latest, page) =>
  fetch(`${apiUrl}/v1/posts/latest?latest=${latest.toISOString()}&page=${page}&pageSize=${pageSize}`,
    { credentials: 'include' })
    .then(response => response.json())
    .then(posts => posts.map(mapPost));

export const fetchBookmarks = (latest, page, accessToken) =>
  fetch(`${apiUrl}/v1/posts/bookmarks?latest=${latest.toISOString()}&page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    })
    .then(response => response.json())
    .then(posts => posts.map(mapPost));

export const fetchSettings = accessToken =>
  fetch(`${apiUrl}/v1/settings`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  })
    .then(response => response.json());

export const updateSettings = (settings, accessToken) =>
  fetch(`${apiUrl}/v1/settings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(settings),
    credentials: 'include',
  });

export const addBookmarks = (bookmarks, accessToken) =>
  fetch(`${apiUrl}/v1/posts/bookmarks`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bookmarks),
    credentials: 'include',
  });

export const removeBookmark = (postId, accessToken) =>
  fetch(`${apiUrl}/v1/posts/${postId}/bookmark`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

export const fetchUserId = () =>
  fetch(`${apiUrl}/v1/users/me`, { credentials: 'include' })
    .then(response => response.json())
    .then(user => user.id);

export const logout = () =>
  fetch(`${apiUrl}/v1/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });
