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
import TouchHandler from '../common/touch';
import { fetchToilet } from '../common/api';
import { trackPage } from '../common/analytics';
import DaToiletItem from '../components/DaToiletItem.vue';

const calcProgress = (value, max) => Math.min(1, Math.max(0, value / max));

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
    this.killTween = () => {
      if (this.tween) {
        this.tween.progress(0);
        this.tween.kill();
        this.tween = null;
      }
    };

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

    this.onPanUp = (e) => {
      const yThresh = 0.4;
      const progThresh = 0.45;

      if (this.panMode === null) {
        this.tween = this.createUpTween(yThresh);
        this.panMode = TouchHandler.UP;
      }

      const height = this.$refs.post.$el.clientHeight * yThresh;
      const progress = calcProgress(e.startPoint.y - e.point.y, height);

      if (progress > progThresh && !this.panPassedThresh) {
        this.$refs.emoji.classList.add('pop');
        this.panPassedThresh = true;
      } else if (progress <= progThresh && this.panPassedThresh) {
        this.panPassedThresh = false;
      }

      this.tween.progress(progress);
    };

    this.onPanHorizontal = (e) => {
      const xThresh = 0.4;
      const progThresh = 0.45;

      const dist = e.point.x - e.startPoint.x;
      const dir = e.dir === TouchHandler.RIGHT ? 1 : -1;

      if (this.panMode === null) {
        if ((!this.enableNext && e.dir === TouchHandler.LEFT) ||
          (!this.enablePrev && e.dir === TouchHandler.RIGHT)) {
          return;
        }

        this.panMode = e.dir;
        this.tween = this.createHorizontalTween(dir);
      }

      const width = this.$refs.post.$el.clientWidth * xThresh;
      const progress = calcProgress(dist * dir, width);

      if (progress > progThresh && !this.panPassedThresh) {
        this.panPassedThresh = true;
      } else if (progress <= progThresh && this.panPassedThresh) {
        this.panPassedThresh = false;
      }

      this.tween.progress(progress);
    };
  },

  mounted() {
    document.documentElement.classList.add('dialog-open');

    trackPage('toilet');

    const upEndCallback = () => {
      this.killTween();
      this.$refs.emoji.classList.remove('pop');
    };

    this.touchHandler = new TouchHandler(
      this.$refs.container,
      {
        start: () => {
          this.pauseTimer = true;
          this.panPassedThresh = false;
        },
        end: () => {
          this.pauseTimer = false;

          if (this.panMode === TouchHandler.UP) {
            if (!this.panPassedThresh) {
              this.tween.reverse().eventCallback('onReverseComplete', upEndCallback);
            } else {
              this.$refs.post.openLink();
              this.tween.play().eventCallback('onComplete', upEndCallback);
            }
            this.panMode = null;
          } else if (this.panMode === TouchHandler.LEFT || this.panMode === TouchHandler.RIGHT) {
            if (!this.panPassedThresh) {
              this.tween.reverse().eventCallback('onReverseComplete', () => {
                this.killTween();
                this.panMode = null;
              });
            } else {
              this.tween.play().eventCallback('onComplete', () => {
                this.killTween();

                if (this.panMode === TouchHandler.LEFT) {
                  this.goToNextPost();
                } else {
                  this.goToPrevPost();
                }
                this.panMode = null;
              });
            }
          }
        },
        pan: (e) => {
          if (e.dir === TouchHandler.UP) {
            this.onPanUp(e);
          } else if (e.dir === TouchHandler.LEFT || e.dir === TouchHandler.RIGHT) {
            this.onPanHorizontal(e);
          }
        },
        resetPan: () => {
          this.killTween();
          this.panMode = null;
        },
      },
    );

    this.touchHandler.start();

    // this.hammer = new Hammer(this.$refs.container, { touchAction: 'pan-y' });
    // this.hammer.get('swipe').set({ enable: true, direction: Hammer.DIRECTION_ALL });
    // this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    // this.hammer.get('press').set({ time: 150 });

    // this.hammer.on('panstart', (e) => {
    //   console.log(e);
    // });
    //
    // this.hammer.on('panup', (e) => {
    //   console.log(e.distance);
    // });
    // this.hammer.on('swipeup', () => {
    //   this.$refs.post.openLink()
    // });
    // this.hammer.on('swipeleft', () => this.nextPost());
    // this.hammer.on('swiperight', () => this.prevPost());
    // this.hammer.on('press', (e) => {
    //   e.preventDefault();
    //   this.pauseTimer = true;
    // });
    // this.hammer.on('tap', (e) => {
    //   const rect = this.$refs.touch.getBoundingClientRect();
    //
    //   if (e.center.y < rect.top || e.center.y > rect.bottom) {
    //     return;
    //   }
    //
    //   if (e.center.x >= rect.left && e.center.x < rect.left + (rect.width / 2)) {
    //     this.prevPost();
    //   } else if (e.center.x < rect.left + rect.width &&
    //     e.center.x >= rect.left + (rect.width / 2)) {
    //     this.nextPost();
    //   }
    // });

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
  user-select: none;
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
