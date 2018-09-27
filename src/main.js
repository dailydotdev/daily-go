import Vue from 'vue';
import svgicon from 'vue-svgicon';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './fonts';

Vue.config.productionTip = false;


Vue.use(svgicon);

const setHeight = (el) => {
  // eslint-disable-next-line no-param-reassign
  el.style.height = `${window.innerHeight}px`;
};
const fitElements = [];

window.addEventListener('resize', () => {
  fitElements.forEach(setHeight);
});

Vue.directive('fit-height', {
  bind: (el) => {
    setHeight(el);
    fitElements.push(el);
  },

  unbind: (el) => {
    fitElements.splice(fitElements.indexOf(el), 1);
  },
});

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


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
