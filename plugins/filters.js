import Vue from 'vue';

Vue.filter('cardTitle', (value) => {
  const maxLength = 102;
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.substr(0, maxLength - 3)}...`;
});

Vue.filter('provider', (value) => {
  if (value === 'github') {
    return 'GitHub';
  }

  return value.replace(/^\w/, c => c.toUpperCase());
});
