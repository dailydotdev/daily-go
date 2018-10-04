<template>
  <div class="dialog-container">
    <div tabindex="0"/>
    <div
      class="dialog"
      role="dialog"
      ref="container"
      aria-modal="true">
      <div
        class="wrapper"
        ref="wrapper">
        <DaToiletItem
          :post="prevPost"
          ref="prevPost"
          :enable-next="false"
          :enable-prev="false"
          :duration="duration"
          :pause-timer="true"
          v-if="prevPost !== null"
          v-show="panMode === 0"/>
        <DaToiletItem
          :post="post"
          ref="post"
          :enable-next="enableNext"
          :enable-prev="enablePrev"
          :duration="duration"
          :pause-timer="pauseTimer"
          v-if="post !== null"/>
        <DaToiletItem
          :post="nextPost"
          ref="nextPost"
          :enable-next="false"
          :enable-prev="false"
          :duration="duration"
          :pause-timer="true"
          v-if="nextPost !== null"
          v-show="panMode === 2"/>
        <div
          class="reveal jumbo horizontal align-center justify-center"
          ref="reveal">
          <div>Enjoy!</div>
          <div
            class="emoji"
            ref="emoji">
            &#x1F913;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import 'gsap/CSSPlugin';
import TweenLite, { Power0 } from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import TouchHandler from '../common/touchHandler';
import PanInteraction from '../common/panInteraction';
import { fetchToilet } from '../common/api';
import { trackPage } from '../common/analytics';
import DaToiletItem from '../components/DaToiletItem.vue';

export default {
  name: 'Toilet',

  components: {
    DaToiletItem,
  },

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
      panMode: null,
    };
  },

  computed: {
    ...mapState({
      accessToken(state) {
        return state.user.profile.accessToken;
      },
    }),

    prevPost() {
      return this.currentIndex === 0 ? null : this.posts[this.currentIndex - 1];
    },

    post() {
      return this.currentIndex >= this.posts.length ? null : this.posts[this.currentIndex];
    },

    nextPost() {
      return this.currentIndex + 1 >= this.posts.length ? null : this.posts[this.currentIndex + 1];
    },

    enablePrev() {
      return this.currentIndex > 0;
    },

    enableNext() {
      return this.currentIndex < this.posts.length || !this.loading || !this.ended;
    },
  },

  created() {
    this.createUpTween = (yThresh) => {
      const duration = 200;

      const tweenWrapper = TweenLite.to(
        this.$refs.wrapper,
        duration / 1000,
        { yPercent: yThresh * -100, ease: Power0.easeNone },
      );

      const tweenReveal = TweenLite.to(
        this.$refs.reveal,
        duration / 1000,
        { opacity: 1 },
      );

      const tween = new TimelineLite();
      tween.add([tweenWrapper, tweenReveal], 0);
      tween.pause();
      return tween;
    };

    this.createHorizontalTween = (dir) => {
      const duration = 500;
      const halfDurationSec = (duration / 2) / 1000;

      const tweenPost1 = TweenLite.to(
        this.$refs.post.$el,
        halfDurationSec,
        {
          xPercent: 50 * dir,
          z: -200,
          rotationY: 45 * dir,
          transformOrigin: `${dir > 0 ? '0' : '100%'} 50%`,
          zIndex: 2,
          ease: Power0.easeNone,
        },
      );

      const tweenPost2 = TweenLite.to(
        this.$refs.post.$el,
        halfDurationSec,
        {
          xPercent: 100 * dir,
          rotationY: 90 * dir,
          opacity: 0.3,
          transformOrigin: `${dir > 0 ? '0' : '100%'} 50%`,
          zIndex: 2,
          ease: Power0.easeNone,
        },
      );

      const tweenNext1 = TweenLite.fromTo(
        dir > 0 ? this.$refs.prevPost.$el : this.$refs.nextPost.$el,
        halfDurationSec,
        {
          xPercent: 100 * -dir,
          rotationY: 90 * -dir,
          opacity: 0.3,
          transformOrigin: `${dir > 0 ? '100%' : '0'} 50%`,
        },
        {
          xPercent: 50 * -dir,
          z: -200,
          rotationY: 45 * -dir,
          transformOrigin: `${dir > 0 ? '100%' : '0'} 50%`,
          ease: Power0.easeNone,
        },
      );

      const tweenNext2 = TweenLite.to(
        dir > 0 ? this.$refs.prevPost.$el : this.$refs.nextPost.$el,
        halfDurationSec,
        {
          xPercent: 0,
          z: 0,
          rotationY: 0,
          opacity: 1,
          transformOrigin: `${dir > 0 ? '100%' : '0'} 50%`,
          ease: Power0.easeNone,
        },
      );

      const tween = new TimelineLite();
      tween.add(tweenPost1, 0);
      tween.add(tweenPost2, halfDurationSec);
      tween.add(tweenNext1, 0);
      tween.add(tweenNext2, halfDurationSec);
      tween.pause();
      return tween;
    };

    const upThresh = 0.4;
    const horThresh = 1;
    const horProgThresh = 0.5;

    this.panInteraction = new PanInteraction({
      [TouchHandler.UP]: {
        tween: () => this.createUpTween(upThresh),
        threshold: 0.45,
        max: () => this.$refs.post.$el.clientHeight * upThresh,
        onThresholdPassed: () => this.$refs.emoji.classList.add('pop'),
        clear: () => this.$refs.emoji.classList.remove('pop'),
        execPreAnimation: () => this.$refs.post.openLink(),
      },
      [TouchHandler.LEFT]: {
        tween: () => this.createHorizontalTween(-1),
        threshold: horProgThresh,
        max: () => this.$refs.post.$el.clientWidth * horThresh,
        execPostAnimation: () => this.goToNextPost(),
        canInteract: () => this.enableNext,
      },
      [TouchHandler.RIGHT]: {
        tween: () => this.createHorizontalTween(1),
        threshold: horProgThresh,
        max: () => this.$refs.post.$el.clientWidth * horThresh,
        execPostAnimation: () => this.goToPrevPost(),
        canInteract: () => this.enablePrev,
      },
    }, () => {
      this.panMode = null;
    });
  },

  mounted() {
    document.documentElement.classList.add('dialog-open');

    trackPage('toilet');

    this.touchHandler = new TouchHandler(
      this.$refs.container,
      {
        start: () => {
          this.pauseTimer = true;
        },
        end: () => {
          this.pauseTimer = false;
          this.panInteraction.end();
        },
        startPan: (e) => {
          this.panMode = e.dir;
          this.panInteraction.startPan(e);
        },
        pan: e => this.panInteraction.pan(e),
        resetPan: () => this.panInteraction.resetPan(),
      },
    );

    this.touchHandler.start();

    this.visibilityChangeCallback = () => {
      this.pauseTimer = !document.hasFocus();
    };
    document.addEventListener('visibilitychange', this.visibilityChangeCallback);
    window.addEventListener('focus', this.visibilityChangeCallback);
    window.addEventListener('blur', this.visibilityChangeCallback);

    this.fetchPage();
  },

  destroyed() {
    document.documentElement.classList.remove('dialog-open');

    document.removeEventListener('visibilitychange', this.visibilityChangeCallback);
    window.removeEventListener('focus', this.visibilityChangeCallback);
    window.removeEventListener('blur', this.visibilityChangeCallback);
    this.touchHandler.stop();
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

      newPosts.forEach((post) => {
        const image = new Image();
        image.src = post.image;
      });
    },

    startTimer() {
      this.elapsed = 0;
      this.lastInterval = new Date();
      this.pauseTimer = false;
    },

    stopTimer() {
      this.pauseTimer = true;
    },

    goToPrevPost() {
      if (!this.enablePrev) {
        return;
      }

      ga('send', 'event', 'Toilet', 'Prev Post');
      this.stopTimer();
      this.currentIndex -= 1;
      this.startTimer();
    },

    goToNextPost() {
      if (!this.enableNext) {
        return;
      }

      ga('send', 'event', 'Toilet', 'Next Post');
      this.stopTimer();
      this.currentIndex += 1;

      if (this.currentIndex + 2 >= this.posts.length && !this.loading) {
        this.fetchPage();
      }

      this.startTimer();
    },
  },
};
</script>

<style>
@keyframes pop {
  50% {
    transform: scale(1.2);
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
  user-select: none;
  touch-action: none;
}

.pop {
  animation: pop 0.3s linear 1;
  transform-origin: center;
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.reveal {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  width: 100%;
  padding: calc(var(--size-space) * 4);
  opacity: 0;
  color: var(--color-github);
  font-weight: bold;

  & .emoji {
    opacity: 0;
    margin-left: var(--size-space);

    &.pop {
      opacity: 1;
    }
  }
}

@media (--tablet) {
  .dialog {
    width: 400px;
    height: 595px;
    margin: auto;
    border-radius: calc(var(--size-space) * 2);
  }
}
</style>
