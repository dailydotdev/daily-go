import { cacheState, deleteState } from '../../services/storage';

const plugin = (store) => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'user/reset') {
      deleteState()
        .catch(err => console.warn('failed to delete cache', err));
    } else if (mutation.type !== 'loadFromCache' && mutation.type.indexOf('reset') < 0) {
      cacheState(state)
        .catch(err => console.warn('failed to cache state', err));
    }
  });
};

export default plugin;
