<template>
  <section class="container sign-in vertical align-center">
    <div class="placeholder-for-image flex"></div>
    <h2 class="jumbo special3">Sign in to Daily to get full sync with your bookmarks</h2>
    <div class="popup">
      <a :href="loginGithub" class="jumbo special2">Login GitHub</a>
      <a :href="loginGoogle" class="jumbo special1">Login Google</a>
    </div>
  </section>
</template>

<script>
import { getLoginLink } from '../services/login';

export default {
  components: {},

  middleware: 'anonymous',

  data() {
    return {
      loginGithub: getLoginLink('github'),
      loginGoogle: getLoginLink('google'),
    };
  },
};
</script>

<style scoped>
.container {
  position: relative;
  height: 100vh;
  padding: 80px 24px 0;

  &.sign-in {
    padding-bottom: 387px;
  }
}

.placeholder-for-image {
  width: 190px;
  background: red;
}

h2 {
  margin: 40px;
  text-align: center;
}

.popup {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 387px;

  background: black;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
}
</style>
