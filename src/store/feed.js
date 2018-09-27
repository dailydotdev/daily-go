import { fetchPublications, fetchBookmarks } from '../common/api';

const initialState = () => ({
  publications: [],
  page: 0,
  latest: null,
  loading: false,
  bookmarks: null,
  showBookmarks: true,
});

const handleNewPage = (state, commit, suffix, posts) => {
  if (!state.page) {
    commit(`set${suffix}`, posts);
  } else {
    commit(`add${suffix}`, posts);
  }

  commit('setLoading', false);

  if (posts.length) {
    commit('setPage', state.page + 1);
  }
};

const fetchBookmarksFeed = (state, commit, accessToken) =>
  fetchBookmarks(state.latest, state.page, accessToken)
    .then((posts) => {
      const postsWithBookmarked = posts.map(p => Object.assign({}, p, { bookmarked: true }));
      handleNewPage(state, commit, 'Bookmarks', postsWithBookmarked);
    });

export default {
  namespaced: true,

  state: initialState(),

  mutations: {
    reset(state) {
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
    },

    setPublications(state, pubs) {
      state.publications = pubs;
    },

    setLatestTime(state, latest) {
      state.latest = latest;
    },

    setPage(state, page) {
      state.page = page;
    },

    setLoading(state, loading) {
      state.loading = loading;
    },

    setBookmarks(state, bookmarks) {
      // if (state.bookmarks && state.posts) {
      //   state.bookmarks.forEach(bookmark => setPostBookmark(state, bookmark.id, false));
      // }
      state.bookmarks = bookmarks;
      // if (state.posts) {
      //   state.bookmarks.forEach(bookmark => setPostBookmark(state, bookmark.id, true));
      // }
    },

    addBookmarks(state, bookmarks) {
      state.bookmarks = state.bookmarks.concat(bookmarks);
    },

    toggleBookmark(state, { id, bookmarked }) {
      // const postIndex = setPostBookmark(state, id, bookmarked);

      if (!bookmarked) {
        const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
        state.bookmarks.splice(index, 1);
      } else {
        // state.bookmarks.unshift(state.posts[postIndex]);
      }
    },
  },

  actions: {
    fetchPublications({ commit }) {
      return fetchPublications()
        .then(pubs => commit('setPublications', pubs));
    },

    fetchNextPage({ commit, state, rootState, rootGetters }) {
      if (state.loading || (state.page >= 5 && !state.showBookmarks)) {
        return false;
      }

      if (!state.page) {
        commit('setLatestTime', new Date());
      }
      commit('setLoading', true);

      if (!rootGetters['user/isLoggedIn']) {
        // fetchAnonymousFeed(state, commit);
      } else if (state.showBookmarks) {
        fetchBookmarksFeed(state, commit, rootState.user.profile.accessToken);
      } else {
        // fetchUserFeed(state, commit, rootState.user.profile.accessToken);
      }

      return true;
    },
  },
};
