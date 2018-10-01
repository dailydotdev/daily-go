<template>
  <div
    class="vertical align-center justify-center"
    v-fit-height>
    <div class="spinner">
      <div class="bounce1"/>
      <div class="bounce2"/>
      <div class="bounce3"/>
    </div>
  </div>
</template>
<script>
import { exchangeCode } from '../common/login';
import { updateId } from '../common/analytics';

export default {
  name: 'OAuth',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const { params, query } = to;
      return exchangeCode(params.provider, query)
        .then((profile) => {
          ga('send', 'event', 'Login', 'Done', params.provider);
          mixpanel.track('Login Done', { provider: params.provider, newUser: profile.newUser });

          updateId(profile.id);
          vm.$store.commit('user/updateProfile', profile);
          if (query.to) {
            vm.$router.replace(query.to);
          } else {
            vm.$router.replace('/');
          }
        })
        .catch(() => {
          ga('send', 'event', 'Login', 'Failed', params.provider);
          mixpanel.track('Login Failed', { provider: params.provider });

          vm.$router.replace('/login');
        });
    });
  },
};
</script>
<style scoped>
.spinner {
  display: flex;
  width: 80px;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;

  & > div {
    width: 18px;
    height: 18px;
    background-color: var(--color-comment);

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  & .bounce1 {
    animation-delay: -0.32s;
  }

  & .bounce2 {
    animation-delay: -0.16s;
  }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}
</style>
