<template>
  <section class="container vertical align-center">
    <div class="illu flex">
      <img src="~/assets/bookmark_illu.svg"/>
    </div>
    <h2 class="subtext special3">Sign in to Daily to get full sync with your bookmarks</h2>
    <div class="login dialog">
      <img class="logo" src="~/assets/logo.svg" alt="Daily logo"/>
      <svgicon class="user" name="user"></svgicon>
      <h1 class="massive">Sign in to Daily</h1>
      <div class="subtext details">It’s exclusive product for developers. Sign in to see all the secret source and enjoy
        with a
        lot of content
        and personal bookmark
      </div>
      <div class="buttons">
        <a class="github caption" :href="loginGithub">
          <svgicon name="github"></svgicon>
          <span>Sign in with GitHub</span>
        </a>
        <div class="or caption">or</div>
        <a class="google" :href="loginGoogle">
          <svgicon name="google"></svgicon>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import { getLoginLink } from '../services/login';

export default {
  components: {},

  middleware: 'anonymous',
  layout: 'empty',

  data() {
    return {
      loginGithub: getLoginLink('github'),
      loginGoogle: getLoginLink('google'),
    };
  },

  mounted() {
    import('../icons/user');
    import('../icons/github');
    import('../icons/google');
  }
};
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
}

.illu {
  position: relative;
  width: 100%;
  margin: calc(var(--size-space) * 3) 0 calc(var(--size-space) / 2);

  & img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    max-height: 190px;
    margin: auto;
  }
}

h2 {
  margin: calc(var(--size-space) * 2) calc(var(--size-space) * 4);
  text-align: center;
}

.login {
  position: relative;
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
      color: var(--color-comment);
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
  .illu {
    margin-top: 55px;
    margin-bottom: 0;

    @media (min-height: 700px) {
      height: 190px;
      flex: none;
    }
  }

  h2 {
    display: flex;
    margin: 0 calc(var(--size-space) * 3);
    align-items: center;
    font-size: 18px;
    line-height: 24px;
    flex: 1;
  }

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
