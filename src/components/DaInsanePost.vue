<template>
  <div
    class="insane-row"
    :class="cls">
    <div class="content flex">
      <a
        :href="link"
        target="_blank"
        class="caption primary"
        @click="onClick">{{ title | cardTitle }}</a>
      <div class="publication horizontal align-center">
        <AsyncImg
          class="logo"
          :src="logo"
          :alt="source"
          sizing="contain"/>
        <div class="caption comment">// {{ source }}</div>
      </div>
    </div>
    <div class="actions vertical align-center justify-center">
      <button
        class="bookmark vertical"
        @click.prevent="onBookmark">
        <svgicon name="bookmark"/>
      </button>
    </div>
  </div>
</template>

<script>
import AsyncImg from '../components/AsyncImg.vue';

export default {
  name: 'DaInsanePost',

  components: {
    AsyncImg,
  },

  props: {
    postId: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    cls() {
      return {
        bookmarked: this.bookmarked,
      };
    },
  },

  methods: {
    onClick() {
      ga('send', 'event', 'Post', 'Click', this.source);
    },

    onBookmark() {
      ga('send', 'event', 'Post', 'Bookmark', this.bookmarked ? 'Remove' : 'Add');
      this.$emit('toggle-bookmark', this.postId);
    },
  },

  mounted() {
    import('../icons/bookmark');
  },
};
</script>

<style scoped>
.publication > * {
  margin: 0 5px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
}

.logo {
  width: 20px;
  height: 20px;
  border-radius: calc(var(--size-space) / 2);
}

.bookmarked .bookmark .svg-icon {
  color: var(--color-highlight);
}
</style>
