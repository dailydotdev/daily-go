<template>
  <div
    class="dialog-container"
    ref="dialogContainer">
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
          v-if="prevPost !== null"
          v-show="panMode === 0"/>
        <DaToiletItem
          class="current-post"
          :post="post"
          ref="post"
          :enable-next="enableNext"
          :enable-prev="enablePrev"
          :duration="duration"
          :pause-timer="pauseTimer"
          @close="animateClose"
          @next-post="animateNextPost"
          @prev-post="animatePrevPost"
          v-if="post !== null"/>
        <DaToiletItem
          :post="nextPost"
          ref="nextPost"
          :enable-next="false"
          :enable-prev="false"
          :duration="duration"
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
import CSSPlugin from 'gsap/CSSPlugin';
import TweenLite, { Power0, Power1 } from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import TouchHandler from '../common/touchHandler';
import PanInteraction from '../common/panInteraction';
import { fetchToilet } from '../common/api';
import { trackPage } from '../common/analytics';
import DaToiletItem from '../components/DaToiletItem.vue';

// workaround to force importing CSSPlugin
// eslint-disable-next-line
CSSPlugin.version;

export default {
  name: 'Toilet',

  components: {
    DaToiletItem,
  },

  data() {
    return {
      elapsed: 0,
      duration: 7000,
      posts: [],
      currentIndex: 0,
      currentPage: 0,
      transition: '',
      loading: false,
      ended: false,
      latest: new Date(),
      lastInterval: new Date(),
      panMode: null,
      pauseTimer: false,
      animating: false,
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
      return this.currentIndex > 0 && !this.animating;
    },

    enableNext() {
      return (this.currentIndex < this.posts.length || !this.loading || !this.ended) &&
        !this.animating;
    },
  },

  created() {
    this.createUpTween = (yThresh) => {
      const duration = 400;

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
      return tween;
    };

    this.createDownTween = (yThresh) => {
      const duration = 250;

      const tweenDialog = TweenLite.to(
        this.$refs.container,
        duration / 1000,
        {
          yPercent: yThresh * 100,
          scale: 0.75,
          ease: Power0.easeNone,
        },
      );

      const tweenDialogContainer = TweenLite.to(
        this.$refs.dialogContainer,
        duration / 1000,
        {
          opacity: 0,
          ease: Power1.easeIn,
        },
      );

      const tween = new TimelineLite();
      tween.add(tweenDialog, 0);
      tween.add(tweenDialogContainer, 0);
      return tween;
    };

    this.createHorizontalTween = (dir) => {
      const duration = 250;
      const halfDurationSec = (duration / 2) / 1000;

      const tweenPost1 = TweenLite.to(
        this.$refs.post.$el,
        halfDurationSec,
        {
          xPercent: 50 * dir,
          z: -200,
          rotationY: 45 * dir,
          transformOrigin: `${dir > 0 ? '0' : '100%'} 50%`,
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
      return tween;
    };

    const upThresh = 0.4;
    const downThresh = 0.6;
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
      [TouchHandler.DOWN]: {
        tween: () => this.createDownTween(downThresh),
        threshold: 0.5,
        max: () => this.$refs.post.$el.clientHeight,
        execPostAnimation: () => {
          this.$router.push('/');
          return true;
        },
      },
      [TouchHandler.LEFT]: {
        tween: () => this.createHorizontalTween(-1),
        threshold: horProgThresh,
        max: () => this.$refs.post.$el.clientWidth * horThresh,
        execPostAnimation: () => this.goToNextPost(),
        canInteract: () => this.enableNext && this.$refs.nextPost && this.$refs.nextPost.$el,
      },
      [TouchHandler.RIGHT]: {
        tween: () => this.createHorizontalTween(1),
        threshold: horProgThresh,
        max: () => this.$refs.post.$el.clientWidth * horThresh,
        execPostAnimation: () => this.goToPrevPost(),
        canInteract: () => this.enablePrev && this.$refs.prevPost && this.$refs.prevPost.$el,
      },
    }, () => {
      this.panMode = null;
      this.animating = false;
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
          if (this.panInteraction.startPan(e)) {
            this.animating = true;
          }
        },
        pan: e => this.panInteraction.pan(e),
        resetPan: () => this.panInteraction.resetPan(),
        tap: (e) => {
          const rect = this.$refs.post.$el.getBoundingClientRect();
          const touch = (e.touches[0] || e.changedTouches[0]);

          if (touch.clientY < rect.top || touch.clientY > rect.bottom) {
            return;
          }

          if (touch.clientX >= rect.left && touch.clientX < rect.left + (rect.width / 2)) {
            this.animatePrevPost();
          } else if (touch.clientX < rect.left + rect.width &&
            touch.clientX >= rect.left + (rect.width / 2)) {
            this.animateNextPost();
          }
        },
        swipe: () => {
          this.panInteraction.swipe();
        },
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

    goToPrevPost() {
      if (this.currentIndex === 0) {
        return;
      }

      ga('send', 'event', 'Toilet', 'Prev Post');
      this.pauseTimer = true;
      this.currentIndex -= 1;

      this.$refs.post.resetTimer();
      this.pauseTimer = false;
    },

    goToNextPost() {
      if (this.currentIndex >= this.posts.length - 1) {
        return;
      }

      ga('send', 'event', 'Toilet', 'Next Post');
      this.pauseTimer = true;
      this.currentIndex += 1;

      if (this.currentIndex + 2 >= this.posts.length && !this.loading) {
        this.fetchPage();
      }

      this.$refs.post.resetTimer();
      this.pauseTimer = false;
    },

    animateClose() {
      this.panInteraction.play(TouchHandler.DOWN);
    },

    animateNextPost() {
      if (!this.enableNext) {
        return;
      }

      this.panMode = TouchHandler.LEFT;
      if (this.panInteraction.play(TouchHandler.LEFT)) {
        this.animating = true;
      }
    },

    animatePrevPost() {
      if (!this.enablePrev) {
        return;
      }

      this.panMode = TouchHandler.RIGHT;
      if (this.panInteraction.play(TouchHandler.RIGHT)) {
        this.animating = true;
      }
    },
  },
};
</script>

<style>
@keyframes pop {
  50% {
    transform: scale(1.3);
  }
}
</style>

<style scoped>
@import '../styles/custom.pcss';

.dialog-container {
  will-change: opacity;
}

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
  will-change: transform;
}

.toilet-item {
  will-change: transform, opacity;
}

.current-post {
  z-index: 2;
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
  color: var(--color-white);
  font-weight: bold;
  will-change: transform;

  & .emoji {
    opacity: 0;
    margin-left: var(--size-space);
    will-change: transform;

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
