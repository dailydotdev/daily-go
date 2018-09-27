window.requestIdleCallback = window.requestIdleCallback ||
  function requestIdleCallback(cb) {
    return setTimeout(() => {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

window.cancelIdleCallback = window.cancelIdleCallback ||
  function cancelIdleCallback(id) {
    clearTimeout(id);
  };
