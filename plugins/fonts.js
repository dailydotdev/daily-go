import '../services/rIC';

export default () => {
  requestIdleCallback(() => {
    import('webfontloader')
      .then(WebFont => {
        WebFont.load({
          custom: {
            families: ['DejaVuSansMono'],
            urls: ['/dejavue.css']
          }
        });
      });
  });
};
