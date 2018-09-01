import { updateSettings, fetchSettings } from '../../services/api';

let syncing = false;

window.requestIdleCallback = window.requestIdleCallback ||
  function (cb) {
    return setTimeout(() => {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

window.cancelIdleCallback = window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };

const syncSettingsFromServer = (store, state) => {
  if (store.getters['user/isLoggedIn']) {
    fetchSettings(state.user.profile.accessToken)
      .then(settings => {
        syncing = true;
        if (settings.theme !== state.theme) {
          store.dispatch('ui/setTheme', settings.theme);
        }
        store.commit('ui/setInsaneMode', settings.appInsaneMode);
        syncing = false;
      });
  }
};

const plugin = (store) => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case 'loadFromCache':
      case 'user/updateProfile':
        requestIdleCallback(() => syncSettingsFromServer(store, state));
        break;
      case 'ui/setTheme':
      case 'ui/setInsaneMode':
        if (!syncing) {
          const settings = {
            theme: state.ui.theme,
            appInsaneMode: state.ui.insaneMode,
          };
          updateSettings(settings, state.user.profile.accessToken);
        }
        break;
    }
  });
};

export default plugin;
