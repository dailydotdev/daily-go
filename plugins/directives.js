import Vue from 'vue';

const setHeight = (el) => el.style.height = `${window.innerHeight}px`;
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
  }
});
