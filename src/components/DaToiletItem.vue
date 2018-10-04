<template>
  <div
    class="toilet-item vertical"
    :class="{ bookmarked }">
    <img
      class="background"
      :src="post.image">
    <header class="vertical">
      <div class="timer">
        <div
          class="timer-progress"
          :style="{animationDuration: `${duration}ms`, animationPlayState: timerAnimState}"/>
      </div>
      <div class="horizontal align-center">
        <AsyncImg
          class="logo"
          :src="logo"
          :alt="source"
          v-if="post.type === 'post'"/>
        <h4 class="caption comment">{{ subheader }}</h4>
        <router-link
          to="/"
          class="back align-right">
          <svgicon name="x"/>
        </router-link>
      </div>
    </header>
    <div class="content horizontal align-center flex">
      <svgicon
        name="up"
        class="show-on-tablet left"
        v-visible="enablePrev"/>
      <h1 class="jumbo flex">{{ title | cardTitle }}</h1>
      <svgicon
        name="up"
        class="show-on-tablet right"
        v-visible="enableNext"/>
    </div>
    <footer class="horizontal align-center">
      <a
        :href="link"
        target="_blank"
        class="horizontal align-center"
        @click.prevent="openLink">
        <svgicon
          name="up"
          class="hide-on-tablet"/>
        <svgicon
          name="link"
          class="show-on-tablet"/>
        <span class="subtext">Open Article</span>
      </a>
      <button
        class="bookmark align-right"
        @click.prevent="onBookmark"
        v-if="post.type === 'post'">
        <svgicon name="bookmark"/>
      </button>
    </footer>
    <img
      v-for="(item, index) in pixel"
      :key="index"
      :src="item"
      class="pixel">
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import AsyncImg from '../components/AsyncImg.vue';

export default {
  name: 'DaToiletItem',

  components: {
    AsyncImg,
  },

  props: {
    post: {
      type: Object,
      required: true,
    },
    enablePrev: {
      type: Boolean,
      required: true,
    },
    enableNext: {
      type: Boolean,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    pauseTimer: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    logo() {
      return this.post.type === 'post' ? this.post.publication.image : '';
    },

    source() {
      return this.post.type === 'post' ? this.post.publication.name : this.post.source;
    },

    title() {
      if (this.post.type === 'post') {
        return this.post.title;
      } else if (this.post.type === 'ad') {
        return this.post.description;
      }
      return '';
    },

    link() {
      if (this.post.type === 'post') {
        return this.post.url;
      } else if (this.post.type === 'ad') {
        return this.post.link;
      }
      return '';
    },

    pixel() {
      return this.post.type === 'ad' ? this.post.pixel : [];
    },

    bookmarked() {
      return this.post ? this.post.bookmarked : false;
    },

    subheader() {
      if (this.post.type === 'post') {
        return `// ${this.source}`;
      } else if (this.post.type === 'ad') {
        return '/# PROMOTED #/';
      }
      return '';
    },

    timerAnimState() {
      return this.pauseTimer ? 'paused' : 'running';
    },
  },

  methods: {
    ...mapMutations({
      toggleBookmark: 'feed/toggleBookmark',
    }),

    openLink() {
      if (this.post.type === 'post') {
        ga('send', 'event', 'Post', 'Click', this.source);
        mixpanel.track('Post Click', { source: this.source, toilet: true });
      } else {
        ga('send', 'event', 'Ad', 'Click', this.source);
        mixpanel.track('Ad Click', { source: this.source, toilet: true });
      }

      const win = window.open(this.link, '_blank');
      win.focus();
    },

    onBookmark() {
      const bookmarked = !this.bookmarked;
      ga('send', 'event', 'Post', 'Bookmark', this.bookmarked ? 'Remove' : 'Add');
      mixpanel.track('Post Bookmark', { source: this.source, toggle: bookmarked, toilet: true });
      this.toggleBookmark({ id: this.post.id, post: this.post, bookmarked });
      this.post.bookmarked = bookmarked;
      // this.nextPost();
    },
  },

  mounted() {
    import('../icons/up');
    import('../icons/link');

    if (this.post.type === 'ad') {
      ga('send', 'event', 'Ad', 'Impression', this.source);
    }
  },
};
</script>
<style>
@keyframes timer {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
<style scoped>
@import '../styles/custom.pcss';

.toilet-item {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
  backface-visibility: hidden;
  background: var(--color-background);
  will-change: transform, opacity;
  transform-style: preserve-3d;
  z-index: 1;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  z-index: -1;
  object-fit: cover;
}

header {
  position: relative;
  padding: calc(var(--size-space) * 3);

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background: linear-gradient(0deg, rgba(39, 39, 39, 0) 0%, var(--color-background) 100%);
    z-index: -1;
  }

  & > * {
    margin: var(--size-space) 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  & h4 {
    font-style: italic;
  }
}

.timer {
  position: relative;
  height: 4px;
  border-radius: 100px;
  background: var(--color-background);
  box-shadow: 0 1px 0 0 #262626, 0 8px 16px 0 rgba(0, 0, 0, 0.1);
}

.timer-progress {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100px;
  background: var(--color-highlight);
  transform-origin: left;
  animation-name: timer;
  animation-timing-function: linear;
}

.logo {
  width: 24px;
  height: 24px;
  margin-right: var(--size-space);
  border-radius: calc(var(--size-space) / 2);
}

.back {
  margin-left: auto;
}

h1 {
  color: var(--color-github);
  margin: 0 calc(var(--size-space) * 4);
}

footer {
  position: relative;
  padding: calc(var(--size-space) * 6) calc(var(--size-space) * 3) calc(var(--size-space) * 3);

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background: linear-gradient(180deg, rgba(39, 39, 39, 0) 0%, var(--color-background) 100%);
    z-index: -1;
  }

  & span {
    color: var(--color-github);
    opacity: 0.5;
    font-style: italic;
    font-weight: bold;
    margin-left: var(--size-space);
  }
}

.content {
  & .svg-icon {
    width: 48px;
    height: 48px;
    cursor: pointer;
  }
}

.svg-icon {
  &.left {
    transform: rotate(-90deg);
  }

  &.right {
    transform: rotate(90deg);
  }
}

.align-right {
  margin-left: auto;
}

.bookmarked .bookmark .svg-icon {
  color: var(--color-highlight);
}

@media (--tablet) {
  footer {
    padding: calc(var(--size-space) * 3);
    background: var(--color-background-highlight);
    box-shadow: 0 -1px 0 0 #262626, 0 -8px 16px 0 rgba(0, 0, 0, 0.2);

    &:before {
      content: none;
    }

    & .svg-icon {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
