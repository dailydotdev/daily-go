<template>
  <div
    class="async-img"
    :style="elemStyle"
    :class="{ loaded, transitioned }">
    <img
      :src="loadedSrc"
      :alt="alt"
      :style="imgStyle"
      @transitionend.once="transitioned = true">
  </div>
</template>

<script>
export default {
  name: 'AsyncImg',

  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    sizing: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      loaded: false,
      transitioned: false,
    };
  },

  computed: {
    loadedSrc() {
      if (this.loaded) {
        return this.src;
      }

      return null;
    },

    imgStyle() {
      if (this.sizing) {
        return {
          'object-fit': this.sizing,
        };
      }

      return {};
    },

    elemStyle() {
      if (this.placeholder && !this.transitioned) {
        return {
          'background-repeat': 'no-repeat',
          'background-size': this.sizing || 'contain',
          'background-image': `url(${this.placeholder})`,
        };
      }

      return {};
    },
  },

  mounted() {
    setTimeout(() => {
      const image = new Image();
      image.onload = () => {
        this.loaded = true;
      };

      image.src = this.src;
    });
  },
};
</script>

<style scoped>
.async-img {
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  opacity: 0;
  will-change: opacity;
}

.loaded img {
  opacity: 1;
  transition: opacity 0.2s;
}

.transitioned img {
  will-change: unset;
}
</style>
