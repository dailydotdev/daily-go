import Vue from 'vue';
import svgicon from 'vue-svgicon';
import VueMasonry from 'vue-masonry-css';
import VueVisible from 'vue-visible';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './fonts';

Vue.config.productionTip = false;


Vue.use(svgicon);
Vue.use(VueMasonry);
Vue.use(VueVisible);

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

const limitString = maxLength => (value) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.substr(0, maxLength - 3)}...`;
};

Vue.filter('cardTitle', limitString(102));
Vue.filter('toiletTitle', limitString(160));

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
