<template>
  <div>
    <nuxt/>
    <DaFooter/>
    <transition name="fade">
      <div class="dialog-container congrats" ref="dialogContainer" v-if="newUser">
        <div tabindex="0"></div>
        <div class="dialog" role="dialog" ref="dialog" aria-modal="true">
          <img src="~/assets/confetti.svg" alt="Confetti"/>
          <h1 class="massive">Congratulations!</h1>
          <p class="text primary">
            Welcome to our community!
            We value each new member and we hope you will enjoy the upcoming features…
          </p>
          <button class="text" @click="closeCongrats">F*** Yeah!</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import '../services/rIC';
import DaFooter from '../components/DaFooter';

export default {
  components: {
    DaFooter,
  },

  computed: {
    ...mapState({
      newUser(state) {
        return state.user.profile && state.user.profile.newUser;
      },
    })
  },

  methods: {
    ...mapMutations({
      closeCongrats: 'user/notNewUser',
    }),
  },

  mounted() {
    requestIdleCallback(() => {
      this.$store.dispatch('feed/fetchPublications');
    });
  }
};
</script>
<style scoped>
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
</style>
