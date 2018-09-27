<template>
  <section
    class="container vertical align-center justify-center"
    v-fit-height>
    <div class="content vertical align-center justify-center">
      <img
        class="logo"
        src="../assets/logo.svg"
        alt="Daily logo">
      <DaTerminal :show-timestamp="false">
        <template slot="title">
          yarn build
        </template>
        <template slot="content">
          <span class="box green">Open</span><span class="green"> http://localhost:3000</span>
          <br><br>
          <!-- eslint-disable -->
          <strong class="green">nuxt:build</strong> [nuxt.config.js] changed <span class="green">+0ms</span><br>
          <strong class="green">nuxt:build</strong> Rebuilding the app... <span class="green">+0ms</span><br>
          <strong class="green">nuxt:pwa</strong> Adding icons <span class="green">+8ms</span><br>
          <strong class="green">nuxt:pwa</strong> Adding manifest <span class="green">+435ms</span><br>
          <span class="box green progress">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="box comment progress">&nbsp;&nbsp;&nbsp;</span><strong
          class="green"> 57%</strong> building modules
          <!-- eslint-enable -->
        </template>
      </DaTerminal>
      <p class="subtext primary">
        <!-- eslint-disable -->
        Currently, Daily Now PWA supports only mobile devices.
        We are working hard to deliver a desktop version, in the meantime, you can download our browser extension.
        Stay tuned!
        <!-- eslint-enable -->
      </p>
      <DaStores/>
    </div>
  </section>
</template>
<script>
import router from '../router';
import checkSupport from '../common/support';
import { trackPage } from '../common/analytics';
import DaTerminal from '../components/DaTerminal.vue';
import DaStores from '../components/DaStores.vue';

export default {
  name: 'NotSupported',

  components: { DaStores, DaTerminal },

  beforeRouteEnter(to, from, next) {
    if (checkSupport()) {
      router.replace('/');
    } else {
      next();
    }
  },

  mounted() {
    import('../icons/bookmark');

    trackPage('notSupported');
  },
};
</script>
<style scoped>
.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.content {
  position: relative;
  width: 100%;
  max-width: 390px;
  background: var(--color-background);
  padding: 24px 0;
  z-index: 100;

  & > * {
    margin: 12px 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  & p {
    width: 100%;
    text-align: center;
  }
}

.logo {
  height: 22px;
}

.terminal {
  width: 100%;
  height: 230px;

  & .progress {
    padding: 0;
  }
}
</style>
