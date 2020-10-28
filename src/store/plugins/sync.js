import '../../common/rIC';
import { updateSettings, fetchSettings, addBookmarks, removeBookmark } from '../../common/api';

let syncing = false;

const syncSettingsFromServer = (store, state) => {
  if (store.getters['user/isLoggedIn']) {
    fetchSettings()
      .then((settings) => {
        syncing = true;
        if (settings.theme !== state.ui.theme) {
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
      case 'feed/toggleBookmark': {
        const { id, bookmarked } = mutation.payload;
        if (bookmarked) {
          addBookmarks([id]);
        } else {
          removeBookmark(id);
        }
        break;
      }
      case 'ui/setTheme':
      case 'ui/setInsaneMode':
        if (!syncing) {
          const settings = {
            theme: state.ui.theme,
            appInsaneMode: state.ui.insaneMode,
          };
          updateSettings(settings);
        }
        break;
      default:
      // Ignore default case
    }
  });
};

export default plugin;
