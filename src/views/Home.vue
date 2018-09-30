<template>
  <div>
    <section class="container">
      <div
        class="empty vertical align-center"
        v-fit-height
        v-if="!posts || !posts.length">
        <div class="bookmark-illu flex">
          <img
            src="../assets/bookmark_illu_bright.svg"
            alt="Bookmark illustration"
            v-if="theme">
          <img
            src="../assets/bookmark_illu.svg"
            alt="Bookmark illustration"
            v-else>
        </div>
        <p class="res-subtext primary">
          Bookmark articles on Daily Go or on Daily browser extension and you'll see it here.
        </p>
        <p class="res-subtext primary">
          Don't have Daily browser extensions yet?<br>
          Make sure to get it here:
        </p>
        <DaStores/>
      </div>
      <div
        class="feed"
        v-else>
        <header>
          <h2 class="subtext comment">/# {{ title }} #/</h2>
          <DaIconSelector
            :pressed="insaneMode"
            @toggle="toggleInsane(!insaneMode)"
            unpressed-icon="line"
            pressed-icon="card"/>
        </header>
        <div
          class="insane"
          v-if="insaneMode">
          <DaInsanePost
            v-for="item in posts"
            :key="item.id"
            :post-id="item.id"
            :link="item.url"
            :title="item.title"
            :source="item.publication.name"
            :logo="item.publication.image"
            :bookmarked="item.bookmarked"
            @toggle-bookmark="toggleBookmark({id: $event, bookmarked: !item.bookmarked})"/>
        </div>
        <masonry
          class="cards"
          :cols="cols"
          :gutter="32"
          v-else>
          <DaPost
            v-for="item in posts"
            :key="item.id"
            :post-id="item.id"
            :link="item.url"
            :img="item.image"
            :title="item.title"
            :source="item.publication.name"
            :logo="item.publication.image"
            :size="item.size"
            :placeholder="item.placeholder"
            :bookmarked="item.bookmarked"
            @toggle-bookmark="toggleBookmark({id: $event, bookmarked: !item.bookmarked})"/>
        </masonry>
        <div
          id="anchor"
          ref="anchor"/>
      </div>
    </section>
    <DaFooter/>
    <router-view/>
    <transition name="fade">
      <div
        class="dialog-container congrats"
        ref="dialogContainer"
        v-if="newUser">
        <div tabindex="0"/>
        <div
          class="dialog"
          role="dialog"
          ref="dialog"
          aria-modal="true">
          <img
            src="../assets/confetti.svg"
            alt="Confetti">
          <h1 class="massive">Congratulations!</h1>
          <p class="text primary">
            Welcome to Daily Go!
            We value every member in our community and we trust you to use Daily Go responsibly....
          </p>
          <button
            class="text"
            @click="closeCongrats">F*** Yeah!
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import 'intersection-observer';
import { mapState, mapMutations, mapActions } from 'vuex';
import '../common/rIC';
import { trackPage } from '../common/analytics';
import { themes } from '../common/theme';
import loggedInGuard from '../router/guards/loggedIn';
import DaFooter from '../components/DaFooter.vue';
import DaInsanePost from '../components/DaInsanePost.vue';
import DaPost from '../components/DaPost.vue';
import DaStores from '../components/DaStores.vue';

export default {
  name: 'Home',

  components: {
    DaFooter,
    DaInsanePost,
    DaPost,
    DaStores,
    DaIconSelector: () => import('../components/DaIconSelector'),
  },

  beforeRouteEnter: loggedInGuard,

  data() {
    return {
      observing: false,
      cols: {
        default: 2,
        700: 1,
      },
    };
  },

  computed: {
    ...mapState({
      newUser(state) {
        return state.user.profile && state.user.profile.newUser;
      },

      posts(state) {
        if (this.showBookmarks) {
          return state.feed.bookmarks;
        }

        return state.feed.posts;
      },

      page(state) {
        return state.feed.page;
      },

      showBookmarks(state) {
        return state.feed.showBookmarks;
      },

      insaneMode(state) {
        return state.ui.insaneMode;
      },

      theme(state) {
        return themes.indexOf(state.ui.theme) > 0;
      },
    }),

    title() {
      return this.showBookmarks ? 'Your personal bookmarks' : 'News for developers';
    },
  },

  methods: {
    ...mapMutations({
      closeCongrats: 'user/notNewUser',
      setInsaneMode: 'ui/setInsaneMode',
      toggleBookmark: 'feed/toggleBookmark',
    }),

    ...mapActions({
      fetchNextPage: 'feed/fetchNextPage',
    }),

    observe() {
      if (!this.observing && this.$refs.anchor) {
        setTimeout(() => this.observer.observe(this.$refs.anchor));
        this.observing = true;
      }
    },

    toggleInsane(pressed) {
      this.setInsaneMode(pressed);
      ga('send', 'event', 'Home', 'Insane', pressed);
    },
  },

  watch: {
    posts() {
      this.observe();
    },
  },

  mounted() {
    trackPage('bookmarks');
    this.observe();

    requestIdleCallback(() => {
      this.$store.dispatch('feed/fetchNextPage');

      requestIdleCallback(() => {
        this.$store.dispatch('feed/fetchPublications');
      });
    });
  },

  created() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.fetchNextPage() && this.page > 0) {
          ga('send', 'event', 'Feed', 'Scroll', 'Next Page', this.page);
        }
      }
    }, { root: null, rootMargin: '0px', threshold: 1 });
  },
};
</script>

<style>
@import '../styles/insane.pcss';
@import '../styles/card.pcss';
</style>

<style scoped>
@import '../styles/custom.pcss';

.container {
  max-width: 672px;
  margin: 0 auto;
}

.congrats .dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--size-space) * 4);

  & > * {
    margin: var(--size-space);

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: calc(var(--size-space) * 3);
    }
  }

  & img {
    width: auto;
    height: 90px;
    margin-bottom: 30px;
  }

  & h1 {
    color: var(--color-github);
    text-transform: uppercase;
    font-weight: bold;
  }

  & p {
    text-align: center;
  }

  & button {
    display: flex;
    width: 160px;
    height: 40px;
    margin-top: calc(var(--size-space) * 4);
    align-items: center;
    justify-content: center;
    color: var(--color-github-invert);
    background: var(--color-github);
    border-radius: var(--size-space);
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    font-weight: 700;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: transform 0.5s ease-out, opacity .5s ease-out;
  will-change: transform, opacity;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.empty {
  height: 100vh;
  padding: 0 calc(var(--size-space) * 3) var(--size-footer);

  & > * {
    margin: calc(var(--size-space) * 1.5) 0;
  }

  & .bookmark-illu {
    margin-top: 56px;
  }

  & p {
    text-align: center;
  }

  & .stores {
    margin-bottom: 40px;
  }
}

.feed {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: var(--size-space) calc(var(--size-space) * 2);
  padding-bottom: var(--size-footer);

  & > * {
    margin: var(--size-space) 0;
  }

  & header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  & h2 {
    font-style: italic;
    text-transform: uppercase;
  }

  & .insane {
    background: var(--color-background-highlight);
    border-radius: var(--size-space);
  }
}

.cards {
  margin: calc(var(--size-space) * -3) 0;
}

.card {
  box-sizing: border-box;
  margin: calc(var(--size-gap) * 2) 0;
}

#anchor {
  position: absolute;
  bottom: 100vh;
  left: 0;
  height: 1px;
  width: 1px;
  opacity: 0;
}

@media (--mobile-m) {
  .empty {
    & > * {
      margin: 20px 0;
    }

    & p {
      font-size: 18px;
      line-height: 24px;
    }
  }
}

@media (--tablet) {
  .feed {
    margin: calc(var(--size-space) * 6) 0;

    & > * {
      margin-top: calc(var(--size-space) * 2);
      margin-bottom: calc(var(--size-space) * 2);

      &.cards {
        margin-top: calc(var(--size-space) * -2);
        margin-bottom: calc(var(--size-space) * -2);
      }
    }
  }
}
</style>
