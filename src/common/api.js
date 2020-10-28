import { apiUrl, pageSize, redirectUrl } from './config';

const redirectLink = post =>
  `${redirectUrl}/r/${post.id}`;

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

export const fetchBookmarks = (latest, page) =>
  fetch(
    `${apiUrl}/v1/posts/bookmarks?latest=${latest.toISOString()}&page=${page}&pageSize=${pageSize}`,
    {
      credentials: 'include',
    },
  )
    .then(response => response.json())
    .then(posts => posts.map(mapPost));

export const fetchToilet = (latest, page) =>
  fetch(
    `${apiUrl}/v1/posts/toilet?latest=${latest.toISOString()}&page=${page}`,
    {
      credentials: 'include',
    },
  )
    .then(response => response.json())
    .then(posts => posts.map(mapPost));

export const fetchSettings = () =>
  fetch(`${apiUrl}/v1/settings`, {
    credentials: 'include',
  })
    .then(response => response.json());

export const updateSettings = settings =>
  fetch(`${apiUrl}/v1/settings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(settings),
    credentials: 'include',
  });

export const addBookmarks = bookmarks =>
  fetch(`${apiUrl}/v1/posts/bookmarks`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(bookmarks),
    credentials: 'include',
  });

export const removeBookmark = postId =>
  fetch(`${apiUrl}/v1/posts/${postId}/bookmark`, {
    method: 'DELETE',
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
