<template>
  <div class="stores">
    <a
      class="caption"
      href="https://chrome.google.com/webstore/detail/daily-discover-web-techno/jlmpjdjjbgclbocgajdjefcidcncaied"
      target="_blank">
      <img src="../assets/chrome.svg">
      Chrome
    </a>
    <a
      class="caption"
      href="https://addons.mozilla.org/en-US/firefox/addon/daily/"
      target="_blank">
      <img src="../assets/firefox.svg">
      Firefox
    </a>
  </div>
</template>

<script>
export default {
  name: 'DaStores',
};
</script>

<style scoped>
.stores {
  display: flex;
  flex-direction: row;

  & a {
    display: flex;
    width: 110px;
    height: 40px;
    margin: 0 var(--size-space);
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: var(--size-space);
    background: var(--color-github);
    color: var(--color-github-invert);
    font-weight: bold;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);

    & img {
      width: auto;
      height: 20px;
      margin-right: 10px;
    }
  }
}
</style>
