<template>
  <section class="container">
    <div class="empty vertical align-center" v-if="!posts || !posts.length">
      <div class="bookmark-illu flex">
        <img src="~/assets/bookmark_illu.svg"/>
      </div>
      <p class="res-subtext primary">
        Add bookmark on your browser and you’ll see all your articles here.
      </p>
      <p class="res-subtext primary">
        If you don’t have Daily extension, you can get it on chrome or firefox.
      </p>
      <DaStores></DaStores>
    </div>
    <div class="feed" v-else>
      <header>
        <h2 class="subtext comment">/# {{title}} #/</h2>
        <DaIconSelector :pressed="insaneMode"
                        @toggle="toggleInsane(!insaneMode)" unpressed-icon="line" pressed-icon="card"/>
      </header>
      <div class="insane" v-if="insaneMode">
        <DaInsanePost v-for="item in posts" :key="item.id" :post-id="item.id" :link="item.url"
                      :title="item.title" :source="item.publication.name"
                      :logo="item.publication.image" :bookmarked="item.bookmarked"></DaInsanePost>
      </div>
      <div class="cards" v-else>
        <DaPost v-for="item in posts" :key="item.id" :post-id="item.id" :link="item.url"
                :img="item.image" :title="item.title" :source="item.publication.name"
                :logo="item.publication.image" :size="item.size" :placeholder="item.placeholder"
                :bookmarked="item.bookmarked"></DaPost>
      </div>
      <div id="anchor" ref="anchor"></div>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import DaInsanePost from '../components/DaInsanePost';
import DaPost from '../components/DaPost';
import DaStores from '../components/DaStores';

export default {
  components: {
    DaInsanePost,
    DaPost,
    DaStores,
    DaIconSelector: () => import('../components/DaIconSelector'),
  },

  middleware: 'logged-in',

  data() {
    return {
      observing: false,
    };
  },

  computed: {
    ...mapState({
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
    }),

    title() {
      return this.showBookmarks ? 'Your personal bookmarks' : 'News for developers';
    },
  },

  methods: {
    ...mapMutations({
      toggleInsane: 'ui/setInsaneMode',
    }),

    ...mapActions({
      fetchNextPage: 'feed/fetchNextPage',
    }),

    observe() {
      if (!this.observing && this.$refs.anchor) {
        setTimeout(() => this.observer.observe(this.$refs.anchor));
        this.observing = true;
      }
    }
  },

  watch: {
    posts() {
      this.observe();
    },
  },

  mounted() {
    this.observe();

    requestIdleCallback(() => {
      this.$store.dispatch('feed/fetchNextPage');
    });
  },

  created() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.fetchNextPage() && this.page > 0) {
          // ga('send', 'event', 'Feed', 'Scroll', 'Next Page', this.page);
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
  display: flex;
  flex-direction: column;
  align-items: stretch;

  & .card {
    margin: 10px 0;
  }
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
</style>
