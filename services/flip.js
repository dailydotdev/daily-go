const capture = ref => ({
  layout: ref.getBoundingClientRect(),
  opacity: getComputedStyle(ref).opacity,
});

const calcTransition = (first, last) => ({
  x: first.layout.left - last.layout.left,
  y: first.layout.top - last.layout.top,
  sx: first.layout.width / last.layout.width,
  sy: first.layout.height / last.layout.height,
  a: last.opacity - first.opacity,
});

const getTransform = (trans, xAxis, yAxis, scale) =>
  `translate(${xAxis ? trans.x : 0}px, ${yAxis ? trans.y : 0}px) 
  scale(${scale ? trans.sx : 1}, ${scale ? trans.sy : 1})`;

export class FLIP {
  constructor(element, xAxis = true, yAxis = true, opacity = true, scale = true) {
    this.element = element;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.opacity = opacity;
    this.scale = scale;
  }

  first(ref = this.element) {
    this._first = capture(ref);
  }

  last(ref = this.element) {
    this._last = capture(ref);
  }

  invert() {
    let willChange = [];

    if (!this._first)
      throw new Error('You must call saveFirst() before invert()');

    if (!this._last)
      throw new Error('You must call saveLast() before invert()');

    const invert = calcTransition(this._first, this._last);

    // Apply the transform.
    if (this.xAxis || this.yAxis || this.scale) {
      this.element.style.transformOrigin = '0 0';
      this.element.style.transform = getTransform(invert, this.xAxis, this.yAxis, this.scale);
      willChange.push('transform');
    }

    if (this.opacity) {
      this.element.style.opacity = this._first.opacity;
      willChange.push('opacity');
    }

    this.element.style.willChange = willChange.join(',');
  }

  play() {
    if (this.xAxis || this.yAxis || this.scale) {
      this.element.style.transform = '';
    }

    if (this.opacity) {
      this.element.style.opacity = '';
    }

    return new Promise((resolve) => {
      const callback = (event) => {
        if (event.target === this.element) {
          this.element.removeEventListener('transitionend', callback);
          resolve();
        }
      };
      this.element.addEventListener('transitionend', callback);
    });
  }
}

export class FLP {
  constructor(element, xAxis = true, yAxis = true, opacity = true, scale = true) {
    this.element = element;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.opacity = opacity;
    this.scale = scale;
  }

  first() {
    this._first = capture(this.element);
  }

  last(ref) {
    this._last = capture(ref);
  }

  play() {
    if (!this._first)
      throw new Error('You must call saveFirst() before invert()');

    if (!this._last)
      throw new Error('You must call saveLast() before invert()');

    const trans = calcTransition(this._last, this._first);

    // Apply the transform.
    if (this.xAxis || this.yAxis || this.scale) {
      this.element.style.transformOrigin = '0 0';
      this.element.style.transform = getTransform(trans, this.xAxis, this.yAxis, this.scale);
    }

    if (this.opacity) {
      this.element.style.opacity = this._last.opacity;
    }

    return new Promise((resolve) => {
      const callback = (event) => {
        if (event.target === this.element) {
          this.element.removeEventListener('transitionend', callback);
          resolve();
        }
      };
      this.element.addEventListener('transitionend', callback);
    });
  }
} 
