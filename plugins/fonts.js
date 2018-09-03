export default () => {
  import('webfontloader')
    .then(WebFont => {
      WebFont.load({
        custom: {
          families: ['DejaVuSansMono'],
          urls: ['/dejavue.css']
        }
      });
    });
};
