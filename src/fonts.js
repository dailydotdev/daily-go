window.WebFontConfig = {
  custom: {
    families: ['DejaVuSansMono'],
    urls: ['https://storage.googleapis.com/devkit-assets/static/dejavue.css'],
  },
};

(function loadWebFont(d) {
  const wf = d.createElement('script');
  const s = d.scripts[0];
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
  wf.async = true;
  s.parentNode.insertBefore(wf, s);
}(document));
