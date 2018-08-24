<template>
  <div>
    <footer v-if="!opened">
      <button class="profile-img btn-icon" v-if="isLoggedIn" @click="opened = true">
        <img :src="profileImage" alt="Profile image"/>
      </button>
      <!--<DaSwitch icon="bookmark" :checked="true" @toggle="onToggleBookmark"></DaSwitch>-->
    </footer>
    <div class="dialog-backdrop" v-else>
      <div tabindex="0"></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <section class="profile-section">
          <div class="header">
            <img class="logo" src="~/assets/logo.svg" alt="Daily logo"/>
            <img class="profile-img" :src="profileImage" alt="Profile image"/>
            <button classs="btn-icon" @click="close()">
              <svgicon name="x"></svgicon>
            </button>
          </div>
          <div class="name jumbo">{{name}}</div>
          <div class="provider text comment">
            <svgicon :name="provider"></svgicon>
            <span>via {{provider | provider}}</span>
          </div>
          <div class="pubs">
            <img v-for="pub in publications" :key="pub.id" :src="pub.image" :alt="pub.name"/>
          </div>
          <div class="text">Customize your feed with:</div>
          <div class="stores">
            <a class="caption"
               href="https://chrome.google.com/webstore/detail/daily-discover-web-techno/jlmpjdjjbgclbocgajdjefcidcncaied"
               target="_blank">
              <img src="~/assets/chrome.svg"/>
              Chrome
            </a>
            <a class="caption"
               href="https://addons.mozilla.org/en-US/firefox/addon/daily/"
               target="_blank">
              <img src="~/assets/firefox.svg"/>
              Firefox
            </a>
          </div>
        </section>
        <section class="settings-section">
          <div class="text heading comment">/# Settings #/</div>
          <DaSwitch :icon="themeIcon" :checked="theme" @toggle="onToggleTheme" label="Theme"></DaSwitch>
          <a target="_blank" class="caption" href="https://www.iubenda.com/privacy-policy/14695236">Privacy Policy</a>
          <a target="_blank" class="caption" href="https://www.iubenda.com/privacy-policy/14695236/cookie-policy">Cookie
            Policy</a>
          <a target="_blank" class="caption" href="https://medium.com/daily-now/daily-terms-of-service-47bb9c9a4b99">Terms
            of Service</a>
          <button class="caption" @click="onLogout">Log out</button>
          <div class="caption comment">// Version {{version}}</div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { version } from '../services/config';

export default {
  name: 'DaFooter',
  components: {
    DaSwitch: () => import('./DaSwitch'),
  },

  data() {
    return {
      opened: false,
      theme: false,
      version,
    };
  },

  computed: {
    themeIcon() {
      return this.theme ? 'sun' : 'moon';
    },

    ...mapState({
      name(state) {
        return this.isLoggedIn ? state.user.profile.name.split(' ')[0] : '';
      },

      profileImage(state) {
        return this.isLoggedIn ? state.user.profile.image : '';
      },

      provider(state) {
        return this.isLoggedIn ? state.user.profile.providers[0] : '';
      },

      publications(state) {
        const pubs = state.feed.publications;
        const size = Math.min(pubs.length, 6);
        for (let i = 0; i < pubs.length; i++) {
          const j = Math.floor(Math.random() * (i + 1));
          [pubs[i], pubs[j]] = [pubs[j], pubs[i]];
        }
        return pubs.slice(0, size);
      }
    }),

    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
    }),
  },

  methods: {
    close() {
      this.opened = false;
    },

    onLogout() {
      this.logout()
        .then(() => this.$router.go({ path: '/' }));
    },

    onToggleTheme(pressed) {
      this.theme = pressed;
    },
    // onToggleBookmark() {
    //
    // },

    ...mapActions({
      logout: 'user/logout',
    }),
  },

  mounted() {
    // import('../icons/bookmark');
    import('../icons/moon');
    import('../icons/sun');
    import('../icons/github');
    import('../icons/google');
    import('../icons/x');
  }
};
</script>

<style scoped>
footer {
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 75px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--size-space) * 2);
  border-radius: 16px 16px 0 0;
  background: var(--color-background-highlight);
  box-shadow: 0 -1px 0 0 var(--color-background), 0 -8px 16px 0 rgba(0, 0, 0, 0.2);
}

button {
  display: inherit;
}

.btn-icon {
  display: flex;
  position: relative;
  height: 28px;
  width: 28px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;

  & img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
  }

  & svg-icon {
    width: 28px;
    height: 28px;
  }
}

.dialog-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  &:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: var(--color-background);
    opacity: 0.52;
  }
}

.dialog {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: var(--color-background-highlight);
  border-radius: calc(var(--size-space) * 2) calc(var(--size-space) * 2) 0 0;
  box-shadow: 0 8px 32px 16px rgba(0, 0, 0, 0.32);

  & section {
    display: flex;
    flex-direction: column;
    padding: calc(var(--size-space) * 3);

    & > * {
      margin: var(--size-space) 0;
    }
  }

  & .profile-section {
    align-items: center;
    padding-bottom: calc(var(--size-space) * 3);
    border-bottom: 1px solid var(--color-tile-border);

    & .profile-img {
      width: 60px;
      height: 60px;
      border-radius: var(--size-space);
    }

    & .name {
      margin-bottom: 0;
      color: var(--color-github);
      font-weight: bold;
    }

    & .provider {
      display: flex;
      flex-direction: row;
      align-items: center;

      & .svg-icon {
        width: 20px;
        height: 20px;
        margin-right: 12px;
        color: var(--color-secondary);
      }
    }

    & .header {
      position: relative;
      align-self: stretch;
      height: 60px;
      margin-top: 0;

      & > * {
        position: absolute;
        top: 0;
      }

      & > :nth-child(1) {
        left: 0;
      }

      & > :nth-child(2) {
        left: 0;
        right: 0;
        margin: auto;
      }

      & > :nth-child(3) {
        right: 0;
      }
    }

    & .logo {
      width: auto;
      height: 24px;
    }

    & .pubs {
      display: flex;
      flex-direction: row;
      margin-top: calc(var(--size-space) * 3);

      & > * {
        width: 30px;
        height: 30px;
        margin: 0 8px;
        border-radius: calc(var(--size-space) / 2);
      }

      & > :first-child, & > :last-child {
        opacity: 0.1;
      }

      & > :nth-child(2), & > :nth-child(5) {
        opacity: 0.3;
      }

      & > :nth-child(3), & > :nth-child(4) {
        opacity: 0.6;
      }
    }

    & .text {
      color: var(--color-primary);
    }

    & .stores {
      display: flex;
      flex-direction: row;

      & a {
        display: flex;
        width: 110px;
        height: 40px;
        margin: 0 var(--size-space);
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: var(--size-space);
        background: var(--color-github);
        color: var(--color-github-invert);
        font-weight: bold;
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);

        & img {
          width: auto;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
  }

  & .settings-section {
    padding-top: calc(var(--size-space) * 3);

    & > * {
      color: var(--color-primary);
    }

    & .heading {
      margin-top: 0;
      font-style: italic;
    }

    & .switch {
      margin: calc(var(--size-space) * 3) 0;
      --da-switch-width: 48px;
      --da-switch-height: 24px;
      --da-switch-slider-height: 16px;
    }
  }
}
</style>
