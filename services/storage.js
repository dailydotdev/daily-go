import localForage from 'localforage';

const store = localForage.createInstance({
  name: 'daily',
});

export const cacheState = state => {
  const keys = ['user', 'feed'];
  const cachedState = Object.keys(state)
    .filter(key => keys.indexOf(key) > -1)
    .reduce((res, cur) => Object.assign({}, res, { [cur]: state[cur] }), {});
  return store.setItem('state', cachedState);
};

export const getState = () => store.getItem('state');

export const deleteState = () => store.removeItem('state');
