<template>
  <div class="terminal vertical">
    <header class="horizontal align-center">
      <div class="button"></div>
      <div class="button"></div>
      <div class="button"></div>
      <div class="caption">
        root@DailyNowLaptop:
        <slot name="title"></slot>
      </div>
    </header>
    <div class="content flex subtext primary">
      <div class="comment time" v-if="showTimestamp">{{ time }}</div>
      <br v-if="showTimestamp">
      <p>
        <slot name="content"></slot>
        <br>
        <span class="cursor">&nbsp;</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaTerminal',

  props: {
    showTimestamp: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      time: (new Date()).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      }),
    };
  },
};
</script>
<style>
@keyframes blink {
  50% {
    opacity: 0.0;
  }
}

.terminal {
  & .box {
    padding: 2px var(--size-space);
    text-transform: uppercase;

    &.red {
      background: #CA4151;
      color: var(--color-github-invert);
    }

    &.green {
      background: var(--color-special4);
      color: var(--color-github-invert);
    }

    &.comment {
      background: var(--color-comment);
      color: var(--color-github-invert);
    }
  }

  & .red {
    color: #CA4151;
  }

  & .green {
    color: var(--color-special4);
  }

  & strong {
    font-weight: bold;
  }
}
</style>
<style scoped>
.terminal {
  align-items: stretch;
}

header {
  height: 34px;
  padding: 0 12px;
  border-radius: var(--size-space) var(--size-space) 0 0;
  background: var(--color-background-highlight);
  box-shadow: 0 8px 32px 16px rgba(0, 0, 0, 0.32);

  & .button {
    width: 10px;
    height: 10px;
    margin: 0 calc(var(--size-space) / 2);
    border-radius: 100%;
    background: var(--color-secondary);

    &:first-child {
      background: #CA4151;
      margin-left: 0;
    }
  }

  & .caption {
    font-weight: bold;
    color: var(--color-github);
    margin-left: var(--size-space);
  }
}

.content {
  padding: calc(var(--size-space) * 2);
  overflow: auto;
  background: var(--color-github-invert);
  border-radius: 0 0 var(--size-space) var(--size-space);
  box-shadow: 0 8px 32px 16px rgba(0, 0, 0, 0.32);
  word-break: break-all;

  & .time {
    text-align: right;
  }

  & .cursor {
    background: var(--color-primary);
    animation: blink 1s step-start 0s infinite;
  }
}
</style>
