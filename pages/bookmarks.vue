<template>
  <section class="container">
    <div class="empty vertical align-center">
      <div class="bookmark-illu flex">
        <img src="~/assets/bookmark_illu.svg"/>
      </div>
      <p class="res-subtext primary">
        Add bookmark on your browser and you’ll see all your articles here.
      </p>
      <p class="res-subtext primary">
        If you don’t have Daily extension, you can get it on chrome or firefox.
      </p>
      <DaStores></DaStores>
    </div>
  </section>
</template>

<script>
import DaStores from '../components/DaStores';

export default {
  components: { DaStores },

  middleware: 'logged-in',

  fetch({ store }) {
    return store.dispatch('feed/fetchPublications');
  },
};
</script>

<style scoped>
.empty {
  height: 100vh;
  padding: 0 calc(var(--size-space) * 3) var(--size-footer);

  & > * {
    margin: calc(var(--size-space) * 1.5) 0;
  }

  & .bookmark-illu {
    margin-top: 56px;
  }

  & p {
    text-align: center;
  }

  & .stores {
    margin-bottom: 40px;
  }
}

@media (--mobile-m) {
  .empty {
    & > * {
      margin: 20px 0;
    }

    & p {
      font-size: 18px;
      line-height: 24px;
    }
  }
}
</style>
