<template>
  <div class="login dialog">
    <img
      class="logo"
      src="../assets/logo.svg"
      alt="Daily logo">
    <svgicon
      class="user"
      name="user"/>
    <h1 class="massive">Daily Go is here!</h1>
    <div class="subtext details">
      Sign in to start using Daily Go exclusively on your mobile and tablet.
      Getting the best curate dev news on the go was never so easy.
    </div>
    <div class="buttons">
      <a
        class="github caption"
        :href="loginGithub"
        @click="trackLogin('github')">
        <svgicon name="github"/>
        <span>Sign in with GitHub</span>
      </a>
      <div class="or subtext">or</div>
      <a
        class="google"
        :href="loginGoogle"
        title="Sign in with Google"
        @click="trackLogin('google')">
        <svgicon name="google"/>
      </a>
    </div>
  </div>
</template>

<script>
import { trackPage } from '../common/analytics';
import { getLoginLink } from '../common/login';
import anonymousGuard from '../router/guards/anonymous';

export default {
  name: 'Login',

  beforeRouteEnter: anonymousGuard,

  data() {
    return {
      loginGithub: getLoginLink('github'),
      loginGoogle: getLoginLink('google'),
    };
  },

  methods: {
    trackLogin(provider) {
      ga('send', 'event', 'Login', 'Initialized', provider);
      mixpanel.track('Login Initialized', { provider });
    },
  },

  mounted() {
    import('../icons/user');
    import('../icons/github');
    import('../icons/google');

    trackPage('login');
  },
};
</script>

<style scoped>
.login {
  display: flex;
  height: 337px;
  align-self: stretch;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--size-space) * 3) calc(var(--size-space) * 4);
  box-shadow: 0 -1px 0 0 var(--color-background), 0 -8px 16px 0 rgba(0, 0, 0, 0.2);

  & .user {
    width: 64px;
    height: 64px;
    margin-bottom: calc(var(--size-space) * 2);
  }

  & .logo {
    position: absolute;
    left: calc(var(--size-space) * 3);
    top: calc(var(--size-space) * 3);
    width: auto;
    height: 22px;
  }

  & h1 {
    color: var(--color-github);
    text-transform: uppercase;
    margin: var(--size-space) 0;
    font-weight: bold;
  }

  & .details {
    color: var(--color-primary);
    margin: var(--size-space) 0;
    font-style: italic;
    text-align: center;
  }

  & .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: calc(var(--size-space) * 2);

    & a {
      background: none;
      border: none;
      margin: 0;
      transition: background 0.2s linear, border 0.2s linear;

      & .svg-icon {
        color: inherit;
        width: 20px;
        height: 20px;
        transition: color 0.2s linear;
      }
    }

    & .github {
      display: flex;
      height: 40px;
      padding: 0 calc(var(--size-space) * 2) 0 10px;
      flex-direction: row;
      align-items: center;
      color: var(--color-github-invert);
      background: var(--color-github);
      border-radius: var(--size-space);
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);

      & span {
        margin-left: 10px;
      }
    }

    & .or {
      margin: 0 calc(var(--size-space) * 2);
      color: var(--color-primary);
      font-weight: bold;
      font-style: italic;
      text-transform: uppercase;
    }

    & .google {
      position: relative;
      width: 33px;
      height: 33px;
      color: var(--color-primary);
      border-radius: var(--size-space);
      border: 1px solid var(--color-primary);

      & > * {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        transition: opacity 0.2s linear;
        will-change: opacity;
      }
    }
  }
}

@media (--mobile-m) {
  .login {
    height: 387px;

    & .details {
      font-size: 16px;
      line-height: 20px;
    }

    & .buttons {
      margin-top: 40px;
    }
  }
}
</style>
