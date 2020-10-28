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
          ref="timer"/>
      </div>
      <div class="horizontal align-center">
        <AsyncImg
          class="logo"
          :src="logo"
          :alt="source"
          v-if="post.type === 'post'"/>
        <h4 class="caption comment">{{ subheader }}</h4>
        <button
          class="back align-right"
          @click.prevent="$emit('close')">
          <svgicon name="x"/>
        </button>
      </div>
    </header>
    <div class="content horizontal align-center flex">
      <button
        class="show-on-tablet"
        v-visible="enablePrev"
        @click.prevent="$emit('prev-post')">
        <svgicon
          name="up"
          class="left"/>
      </button>
      <h1 class="jumbo flex">{{ title | toiletTitle }}</h1>
      <button
        class="show-on-tablet"
        v-visible="enableNext"
        @click.prevent="$emit('next-post')">
        <svgicon
          name="up"
          class="right"/>
      </button>
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
import 'gsap/CSSPlugin';
import TweenLite, { Power0 } from 'gsap/TweenLite';
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
      default: true,
    },
  },

  data() {
    return {
      bookmarked: false,
    };
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

    subheader() {
      if (this.post.type === 'post') {
        return `// ${this.source}`;
      } else if (this.post.type === 'ad') {
        return '/# PROMOTED #/';
      }
      return '';
    },
  },

  methods: {
    ...mapMutations({
      toggleBookmark: 'feed/toggleBookmark',
    }),

    openLink() {
      if (this.post.type === 'post') {
        ga('send', 'event', 'Post', 'Click', this.source);
      } else {
        ga('send', 'event', 'Ad', 'Click', this.source);
      }

      const win = window.open(this.link, '_blank');
      win.focus();
    },

    onBookmark() {
      const bookmarked = !this.bookmarked;
      ga('send', 'event', 'Post', 'Bookmark', this.bookmarked ? 'Remove' : 'Add');
      this.toggleBookmark({ id: this.post.id, post: this.post, bookmarked });
      this.bookmarked = bookmarked;
    },

    resetTimer() {
      this.timerTween.progress(0);
    },
  },

  watch: {
    pauseTimer() {
      if (this.pauseTimer) {
        this.timerTween.pause();
      } else {
        this.timerTween.resume();
      }
    },

    post() {
      if (this.post) {
        this.bookmarked = this.post.bookmarked;
      }
    },
  },

  mounted() {
    import('../icons/up');
    import('../icons/link');
    import('../icons/bookmark');

    if (this.post.type === 'ad') {
      ga('send', 'event', 'Ad', 'Impression', this.source);
    }

    this.timerTween = TweenLite.fromTo(
      this.$refs.timer,
      this.duration / 1000,
      { width: 0 },
      {
        width: '100%',
        ease: Power0.easeNone,
      },
    );

    this.timerTween.eventCallback('onComplete', () => this.$emit('next-post'));

    if (this.pauseTimer) {
      this.timerTween.pause();
    } else {
      this.timerTween.play();
    }
  },

  destroyed() {
    this.timerTween.kill();
  },
};
</script>
<style>
@keyframes bookmark {
  50% {
    transform: scale(1.5);
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
  padding: calc(var(--size-space) * 4) calc(var(--size-space) * 3);

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background: linear-gradient(0deg, var(--color-white-trans) 0%, var(--color-black) 100%);
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
  will-change: width;
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
  color: var(--color-white);
  margin: 0 calc(var(--size-space) * 4);
}

footer {
  position: relative;
  padding: calc(var(--size-space) * 6) calc(var(--size-space) * 3) calc(var(--size-space) * 4);

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background: linear-gradient(180deg, var(--color-white-trans) 0%, var(--color-black) 100%);
    z-index: -1;
  }

  & span {
    color: var(--color-white);
    opacity: 0.5;
    font-style: italic;
    font-weight: bold;
    margin-left: var(--size-space);
  }

  & a:hover span {
    opacity: 1;
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

.bookmark .svg-icon {
  transition: color 0.3s ease-in;
  transform-origin: center;
}

.bookmarked .bookmark {
  animation: bookmark 0.3s linear 1;

  & .svg-icon {
    color: var(--color-highlight);
  }
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

  h1 {
    margin: 0;
  }
}
</style>
