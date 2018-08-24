<template>
  <section class="container"></section>
</template>

<script>
export default {
  components: {},

  middleware: 'logged-in',

  fetch({ store }) {
    return store.dispatch('feed/fetchPublications');
  },
};
</script>
