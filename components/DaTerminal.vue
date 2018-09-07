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
      <div class="comment time">{{ time }}</div>
      <br>
      <p>
        <slot name="content"></slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaTerminal',

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
.terminal {
  & .box {
    padding: 2px var(--size-space);

    &.red {
      background: #CA4151;
      color: var(--color-github-invert);
    }
  }

  & .red {
    color: #CA4151;
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
  background: var(--color-github-invert);
  border-radius: 0 0 var(--size-space) var(--size-space);
  box-shadow: 0 8px 32px 16px rgba(0, 0, 0, 0.32);
  word-break: break-all;

  & .time {
    text-align: right;
  }
}
</style>
