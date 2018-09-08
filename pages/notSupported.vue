<template>
  <section class="container vertical align-center justify-center" v-fit-height>
    <div class="content vertical align-center justify-center">
      <img class="logo" src="~/assets/logo.svg" alt="Daily logo"/>
      <DaTerminal :show-timestamp="false">
        <template slot="title">
          yarn build
        </template>
        <template slot="content">
          <span class="box green">Open</span><span class="green"> http://localhost:3000</span>
          <br><br>
          <strong class="green">nuxt:build</strong> [nuxt.config.js] changed <span class="green">+0ms</span><br>
          <strong class="green">nuxt:build</strong> Rebuilding the app... <span class="green">+0ms</span><br>
          <strong class="green">nuxt:pwa</strong> Adding icons <span class="green">+8ms</span><br>
          <strong class="green">nuxt:pwa</strong> Adding manifest <span class="green">+435ms</span><br>
          <span class="box green progress">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="box comment progress">&nbsp;&nbsp;&nbsp;</span><strong
          class="green"> 57%</strong> building modules
        </template>
      </DaTerminal>
      <p class="subtext primary">
        Currently, Daily Now PWA supports only mobile devices.
        If you want to stay up to date you can download the browser extension.
      </p>
      <DaStores></DaStores>
    </div>
    <div class="insane" ref="insane">
      <DaInsanePost v-for="item in insane" :key="item.id" :post-id="item.id" :link="item.url"
                    :title="item.title" :source="item.publication.name"
                    :logo="item.publication.image"></DaInsanePost>
    </div>
    <div class="cards" ref="cards">
      <DaPost v-for="item in cards" :key="item.id" :post-id="item.id" :link="item.url"
              :img="item.image" :title="item.title" :source="item.publication.name"
              :logo="item.publication.image" :size="item.size" :placeholder="item.placeholder"></DaPost>
    </div>
    <DaSwitch icon="bookmark" :checked="true"></DaSwitch>
    <div class="footer">
      <img src="~/assets/ido.jpeg" alt="Profile image"/>
    </div>
  </section>
</template>

<script>
import DaTerminal from '../components/DaTerminal';
import DaStores from '../components/DaStores';
import { fetchLatestPosts } from '../services/api';
import DaInsanePost from '../components/DaInsanePost';
import DaPost from '../components/DaPost';
import DaSwitch from '../components/DaSwitch';
import { trackPage } from '../services/analytics';

export default {
  components: { DaPost, DaInsanePost, DaStores, DaTerminal, DaSwitch },

  data() {
    return {
      insane: [],
      cards: [],
    };
  },

  mounted() {
    // Workaround as nuxt currently calls mounted twice
    this.$nextTick(() => {
      import('../icons/bookmark');

      trackPage('notSupported');

      fetchLatestPosts(new Date(), 0)
        .then((posts) => {
          this.insane = posts.slice(0, posts.length * 2 / 3);
          this.cards = posts.slice(posts.length * 2 / 3, posts.length);
        });
    });

    window.addEventListener('mousewheel', (event) => {
      const delta = event.deltaY;
      this.$refs.cards.scrollTop = Math.max(0, Math.min(this.$refs.cards.scrollTop - delta, this.$refs.cards.scrollHeight));
      this.$refs.insane.scrollTop = Math.max(0, Math.min(this.$refs.insane.scrollTop + delta, this.$refs.insane.scrollHeight));
    });
  }
};
</script>

<style>
@import '../styles/insane.pcss';
@import '../styles/card.pcss';
</style>

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

.insane {
  position: absolute;
  right: 0;
  top: 73%;
  width: 330px;
  height: 290px;
  overflow: hidden;
  background: var(--color-background-highlight);
  border-radius: var(--size-space);
}

.cards {
  position: absolute;
  bottom: 80%;
  left: 60px;
  width: 330px;
  height: 330px;
  overflow: hidden;
}

.switch {
  position: absolute;
  bottom: 12%;
  left: 50%;
}

.footer {
  position: absolute;
  display: flex;
  left: 3%;
  bottom: 5%;
  width: 500px;
  height: 120px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--size-space) * 3);
  border-radius: 16px 16px 0 0;
  background: var(--color-background-highlight);
  box-shadow: 0 -1px 0 0 var(--color-background), 0 -8px 16px 0 rgba(0, 0, 0, 0.2);

  & img {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    object-fit: cover;
  }
}
</style>
