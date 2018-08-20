<template>
  <section class="container"></section>
</template>

<script>
export default {
  components: {},

  middleware: 'oauth',
  validate({ params }) {
    return params.provider === 'google' || params.provider === 'github';
  },
};
</script>
