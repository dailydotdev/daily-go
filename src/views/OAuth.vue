<template>
  <div
    class="vertical align-center justify-center"
    v-fit-height>
    <DaSpinner/>
  </div>
</template>
<script>
import { exchangeCode } from '../common/login';
import { updateId } from '../common/analytics';
import DaSpinner from '../components/DaSpinner.vue';

export default {
  name: 'OAuth',
  components: { DaSpinner },
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
