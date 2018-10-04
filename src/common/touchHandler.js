const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

const touchToPoint = t => ({
  x: t.clientX,
  y: t.clientY,
});

const changedTouchToPoint = e => touchToPoint(e.touches[0] || e.changedTouches[0]);

const sqrtDist = (p1, p2) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return (dx * dx) + (dy * dy);
};

const angleRadians = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

const angleToDirection = (angle) => {
  const positiveAngle = angle < 0 ? angle + (Math.PI * 2) : angle;
  if (positiveAngle >= Math.PI * 1.75 || positiveAngle < Math.PI * 0.25) {
    return RIGHT;
  } else if (positiveAngle < Math.PI * 0.75) {
    return DOWN;
  } else if (positiveAngle < Math.PI * 1.25) {
    return LEFT;
  }
  return UP;
};

export default class TouchHandler {
  static RIGHT = RIGHT;
  static DOWN = DOWN;
  static LEFT = LEFT;
  static UP = UP;

  constructor(elem, callbacks) {
    this.elem = elem;
    this.callbacks = callbacks;
    this.panThreshold = 10 * 10;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  }

  start() {
    this.elem.addEventListener('touchstart', this.onTouchStart, { passive: false });
  }

  stop() {
    this.elem.removeEventListener('touchstart', this.onTouchStart);
  }

  resetPan(e) {
    this.startEvent = e;
    this.isPanning = false;
  }

  onTouchStart(e) {
    const path = e.path || (e.composedPath && e.composedPath());
    const clickable = path.find((el) => {
      const tag = el.tagName && el.tagName.toLowerCase();
      return tag === 'a' || tag === 'button';
    });
    if (clickable) {
      return;
    }

    e.preventDefault();

    this.startEvent = e;
    this.bindOnTouch();

    this.callbacks.start();
  }

  bindOnTouch() {
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });

    window.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.isPanning = false;
      this.panDir = null;
      this.callbacks.end();
      window.removeEventListener('touchmove', this.onTouchMove);
    }, { once: true, passive: false });
  }

  onTouchMove(e) {
    const start = changedTouchToPoint(this.startEvent);
    const end = changedTouchToPoint(e);
    const dir = angleToDirection(angleRadians(start, end));


    if (!this.isPanning) {
      const dist = sqrtDist(start, end);
      if (dist >= this.panThreshold) {
        this.isPanning = true;
        this.panDir = dir;
        this.callbacks.startPan({
          startEvent: this.startEvent,
          event: e,
          startPoint: start,
          point: end,
          dir: this.panDir,
        });
      } else {
        return;
      }
    }

    const customEvent = {
      startEvent: this.startEvent,
      event: e,
      startPoint: start,
      point: end,
      dir: this.panDir,
    };

    const distY = end.y - start.y;
    const distX = end.x - start.x;

    if ((this.panDir === TouchHandler.RIGHT && distX < 0) ||
      (this.panDir === TouchHandler.LEFT && distX > 0) ||
      (this.panDir === TouchHandler.UP && distY > 0) ||
      (this.panDir === TouchHandler.DOWN && distY < 0)) {
      this.resetPan(e);
      this.callbacks.resetPan(customEvent);
      return;
    }

    this.callbacks.pan(customEvent);
  }
}
