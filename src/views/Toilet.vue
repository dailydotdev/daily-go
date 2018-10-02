<template>
  <div class="dialog-container">
    <div tabindex="0"/>
    <div
      class="dialog"
      :class="{ bookmarked }"
      role="dialog"
      ref="container"
      aria-modal="true">
      <transition :name="transition">
        <div
          class="post vertical"
          :key="currentIndex">
          <img
            class="background"
            :src="image"
            v-show="image.length > 0">
          <header class="vertical">
            <div class="timer">
              <div
                class="timer-progress"
                ref="timerProgress"
                :style="{width: timerProgress}"/>
            </div>
            <div class="horizontal align-center">
              <img
                class="logo"
                :src="logo"
                :alt="source"
                v-show="type === 'post'">
              <h4 class="caption comment">{{ subheader }}</h4>
              <router-link
                to="/"
                class="back align-right">
                <svgicon name="x"/>
              </router-link>
            </div>
          </header>
          <div
            class="content horizontal align-center flex"
            ref="touch">
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
              @click.prevent="openPost">
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
              v-show="type === 'post'">
              <svgicon name="bookmark"/>
            </button>
          </footer>
        </div>
      </transition>
    </div>
    <img
      v-for="(item, index) in pixel"
      :key="index"
      :src="item"
      class="pixel">
  </div>
</template>

<script>
import Hammer from 'hammerjs';
import { mapState, mapMutations } from 'vuex';
import { fetchToilet } from '../common/api';
import { trackPage } from '../common/analytics';

export default {
  name: 'Toilet',

  data() {
    return {
      elapsed: 0,
      duration: 10000,
      posts: [],
      currentIndex: 0,
      currentPage: 0,
      transition: '',
      pauseTimer: false,
      loading: false,
      ended: false,
      latest: new Date(),
      lastInterval: new Date(),
    };
  },

  computed: {
    ...mapState({
      accessToken(state) {
        return state.user.profile.accessToken;
      },
    }),

    currentPost() {
      return this.currentIndex >= this.posts.length ? null : this.posts[this.currentIndex];
    },

    timerProgress() {
      return `${(this.elapsed * 100) / this.duration}%`;
    },

    image() {
      return this.currentPost ? this.currentPost.image : '';
    },

    logo() {
      return this.type === 'post' ? this.currentPost.publication.image : '';
    },

    source() {
      return this.type === 'post' ? this.currentPost.publication.name : '';
    },

    title() {
      if (this.type === 'post') {
        return this.currentPost.title;
      } else if (this.type === 'ad') {
        return this.currentPost.description;
      }
      return '';
    },

    link() {
      if (this.type === 'post') {
        return this.currentPost.url;
      } else if (this.type === 'ad') {
        return this.currentPost.link;
      }
      return '';
    },

    pixel() {
      return this.type === 'ad' ? this.currentPost.pixel : [];
    },

    type() {
      return this.currentPost ? this.currentPost.type : '';
    },

    bookmarked() {
      return this.currentPost ? this.currentPost.bookmarked : false;
    },

    subheader() {
      if (this.type === 'post') {
        return `// ${this.source}`;
      } else if (this.type === 'ad') {
        return '/# PROMOTED #/';
      }
      return '';
    },

    enablePrev() {
      return this.currentIndex > 0;
    },

    enableNext() {
      return this.currentIndex < this.posts.length || !this.loading || !this.ended;
    },
  },

  watch: {
    type() {
      if (this.type === 'ad') {
        ga('send', 'event', 'Ad', 'Impression', this.source);
      }
    },
  },

  mounted() {
    import('../icons/up');
    import('../icons/link');

    trackPage('toilet');

    this.hammer = new Hammer(this.$refs.container);
    this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    this.hammer.get('press').set({ time: 150 });
    this.hammer.on('swipeup', () => this.openPost());
    this.hammer.on('swipeleft', () => this.nextPost());
    this.hammer.on('swiperight', () => this.prevPost());
    this.hammer.on('press', (e) => {
      e.preventDefault();
      this.pauseTimer = true;
    });
    this.hammer.on('pressup', (e) => {
      e.preventDefault();
      this.pauseTimer = false;
    });
    this.hammer.on('tap', (e) => {
      const rect = this.$refs.touch.getBoundingClientRect();

      if (e.center.y < rect.top || e.center.y > rect.bottom) {
        return;
      }

      if (e.center.x >= rect.left && e.center.x < rect.left + (rect.width / 2)) {
        this.prevPost();
      } else if (e.center.x < rect.left + rect.width &&
        e.center.x >= rect.left + (rect.width / 2)) {
        this.nextPost();
      }
    });

    this.visibilityChangeCallback = () => {
      this.pauseTimer = !document.hasFocus();
    };
    document.addEventListener('visibilitychange', this.visibilityChangeCallback);
    window.addEventListener('focus', this.visibilityChangeCallback);
    window.addEventListener('blur', this.visibilityChangeCallback);

    this.fetchPage()
      .then(() => {
        if (this.posts.length) {
          this.timerInterval = setInterval(() => this.onInterval(), 100);
        }
      });
  },

  destroyed() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    document.removeEventListener('visibilitychange', this.visibilityChangeCallback);
    window.removeEventListener('focus', this.visibilityChangeCallback);
    window.removeEventListener('blur', this.visibilityChangeCallback);
    this.hammer.destroy();
  },

  methods: {
    ...mapMutations({
      toggleBookmark: 'feed/toggleBookmark',
    }),

    async fetchPage() {
      this.loading = true;
      const newPosts = await fetchToilet(this.latest, this.currentPage, this.accessToken);
      if (newPosts) {
        this.currentPage += 1;
      }

      if (newPosts.length <= 1) {
        this.ended = true;
      }

      this.loading = false;
      this.posts = this.posts.concat(newPosts);
    },

    startTimer() {
      this.elapsed = 0;
      this.lastInterval = new Date();
      this.pauseTimer = false;
    },

    stopTimer() {
      this.pauseTimer = true;
    },

    prevPost() {
      if (!this.enablePrev) {
        return;
      }

      ga('send', 'event', 'Toilet', 'Prev Post');
      this.stopTimer();
      this.transition = 'cube-right';
      this.currentIndex -= 1;
      this.startTimer();
    },

    nextPost() {
      if (!this.enableNext) {
        return;
      }

      ga('send', 'event', 'Toilet', 'Next Post');
      this.stopTimer();
      this.transition = 'cube-left';
      this.currentIndex += 1;

      if (this.currentIndex + 2 >= this.posts.length && !this.loading) {
        this.fetchPage();
      }

      this.startTimer();
    },

    onInterval() {
      const current = new Date();
      const dt = current - this.lastInterval;
      this.lastInterval = current;

      if (this.pauseTimer) {
        return;
      }

      this.elapsed += dt;

      if (this.elapsed >= this.duration) {
        this.elapsed = this.duration;
        this.nextPost();
      }
    },

    openPost() {
      if (this.type === 'post') {
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
      this.toggleBookmark({ id: this.currentPost.id, post: this.currentPost, bookmarked });
      this.currentPost.bookmarked = bookmarked;
      this.nextPost();
    },
  },
};
</script>

<style>
.cube-left-enter-active {
  transform-origin: 0 50%;
  animation: cubeLeftIn 0.4s both ease-in;
}

.cube-left-leave-active {
  transform-origin: 100% 50%;
  animation: cubeLeftOut 0.4s both ease-in;
  z-index: 2;
}

.cube-right-enter-active {
  transform-origin: 100% 50%;
  animation: cubeRightIn 0.4s both ease-in;
}

.cube-right-leave-active {
  transform-origin: 0 50%;
  animation: cubeRightOut 0.4s both ease-in;
  z-index: 2;
}

@keyframes cubeLeftOut {
  0% {
  }
  50% {
    animation-timing-function: ease-out;
    transform: translateX(-50%) translateZ(-200px) rotateY(-45deg);
  }
  100% {
    opacity: .3;
    transform: translateX(-100%) rotateY(-90deg);
  }
}

@keyframes cubeLeftIn {
  0% {
    opacity: .3;
    transform: translateX(100%) rotateY(90deg);
  }
  50% {
    animation-timing-function: ease-out;
    transform: translateX(50%) translateZ(-200px) rotateY(45deg);
  }
}

@keyframes cubeRightOut {
  0% {
  }
  50% {
    animation-timing-function: ease-out;
    transform: translateX(50%) translateZ(-200px) rotateY(45deg);
  }
  100% {
    opacity: .3;
    transform: translateX(100%) rotateY(90deg);
  }
}

@keyframes cubeRightIn {
  0% {
    opacity: .3;
    transform: translateX(-100%) rotateY(-90deg);
  }
  50% {
    animation-timing-function: ease-out;
    transform: translateX(-50%) translateZ(-200px) rotateY(-45deg);
  }
}
</style>

<style scoped>
@import '../styles/custom.pcss';

.dialog {
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  overflow: hidden;
  background: var(--color-background);
  border-radius: 0;
  perspective: 1200px;
  box-shadow: none;
}

.post {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  z-index: 1;
  overflow: hidden;
  backface-visibility: hidden;
  will-change: transform;
  transform-style: preserve-3d;
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
  height: 100%;
  border-radius: 100px;
  background: var(--color-highlight);
  transition: width 0.2s linear;
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

.show-on-tablet {
  display: none;
}

.bookmarked .bookmark .svg-icon {
  color: var(--color-highlight);
}

@media (--tablet) {
  .dialog {
    width: 400px;
    height: 595px;
    margin: auto;
    border-radius: calc(var(--size-space) * 2);
  }

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

  .hide-on-tablet {
    display: none;
  }

  .show-on-tablet {
    display: block;
  }
}
</style>
