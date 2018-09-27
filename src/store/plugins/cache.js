import { cacheState } from '../../common/storage';

const plugin = (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type !== 'loadFromCache' && mutation.type.indexOf('reset') < 0) {
      cacheState(state)
        // eslint-disable-next-line no-console
        .catch(err => console.warn('failed to cache state', err));
    }
  });
};

export default plugin;
