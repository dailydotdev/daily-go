export default function ({ store, redirect, route }) {
  if (route.name === 'notSupported' && /Mobi|Android/i.test(navigator.userAgent)) {
    redirect('/');
  }
};
