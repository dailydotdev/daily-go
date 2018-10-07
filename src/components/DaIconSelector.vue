<template>
  <button
    class="icon-selector"
    :pressed="pressed"
    @click.prevent="toggle">
    <svgicon
      :name="unpressedIcon"
      class="unpressed"/>
    <svgicon
      :name="pressedIcon"
      class="pressed"/>
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
    unpressedIcon: {
      type: String,
      required: true,
    },
    pressedIcon: {
      type: String,
      required: true,
    },
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
    color: var(--color-white);
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
  width: 100%;
  height: 100%;
  color: inherit;
}

.pressed {
  display: none;
}
</style>
