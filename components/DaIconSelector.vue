<template>
  <button class="icon-selector" :pressed="pressed" @click.prevent="toggle">
    <svgicon :name="unpressedIcon" class="unpressed"></svgicon>
    <svgicon :name="pressedIcon" class="pressed"></svgicon>
  </button>
</template>

<script>
export default {
  name: 'DaIconSelector',

  props: {
    pressed: {
      type: Boolean,
      default: false,
    },
    unpressedIcon: String,
    pressedIcon: String,
  },

  methods: {
    toggle() {
      this.$emit('toggle', !this.pressed);
    },
  },

  mounted() {
    import(`../icons/${this.unpressedIcon}`);
    import(`../icons/${this.pressedIcon}`);
  },
};
</script>

<style scoped>
.icon-selector {
  display: block;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  outline: 0;

  &:hover .svg-icon {
    color: var(--color-github);
  }

  &[pressed] {
    & .pressed {
      display: block;
    }

    & .unpressed {
      display: none;
    }
  }
}

.svg-icon {
  width: 28px;
  height: 28px;
  color: var(--color-comment);
}

.pressed {
  display: none;
}
</style>
