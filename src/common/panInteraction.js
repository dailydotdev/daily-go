import TouchHandler from './touchHandler';

const calcAxisDelta = (e) => {
  if (e.dir === TouchHandler.RIGHT) {
    return e.point.x - e.startPoint.x;
  } else if (e.dir === TouchHandler.LEFT) {
    return e.startPoint.x - e.point.x;
  } else if (e.dir === TouchHandler.UP) {
    return e.startPoint.y - e.point.y;
  }
  return e.point.y - e.startPoint.y;
};

const calcProgress = (value, max) => Math.min(1, Math.max(0, value / max));

export default class PanInteraction {
  constructor(interactions, globalClear) {
    this.interactions = interactions;
    this.globalClear = globalClear;
  }

  startPan(e) {
    const interaction = this.interactions[e.dir];
    if (interaction && (!interaction.canInteract || interaction.canInteract())) {
      this.active = interaction;
      this.tween = interaction.tween();
      this.tween.pause();
      return true;
    }
    return false;
  }

  pan(e) {
    if (this.active) {
      const dist = calcAxisDelta(e);
      const max = this.active.max();
      const progress = calcProgress(dist, max);

      this.tween.progress(progress);

      if (progress > this.active.threshold && !this.passedThresh) {
        this.passedThresh = true;
        if (this.active.onThresholdPassed) {
          this.active.onThresholdPassed();
        }
      } else if (progress <= this.active.threshold && this.passedThresh) {
        this.passedThresh = false;
      }
    }
  }

  resetPan() {
    if (this.active) {
      if (this.active.clear) {
        this.active.clear();
      }

      this.active = null;
      this.passedThresh = false;

      this.tween.progress(0);
      this.tween.kill();
      this.tween = null;
    }

    if (this.globalClear) {
      this.globalClear();
    }
  }

  end() {
    if (this.active && !this.playing) {
      if (this.passedThresh) {
        if (this.active.execPreAnimation) {
          this.active.execPreAnimation();
        }
        this.tween.play().eventCallback('onComplete', () => this.tweenComplete());
      } else {
        this.tween.reverse().eventCallback('onReverseComplete', () => {
          this.resetPan();
        });
      }
    }
  }

  play(dir) {
    if (!this.playing && this.startPan({ dir })) {
      this.playing = true;
      this.tween
        .play()
        .eventCallback('onComplete', () => this.tweenComplete());
    }
  }

  tweenComplete() {
    this.playing = false;
    let async = false;
    if (this.active.execPostAnimation) {
      async = this.active.execPostAnimation();
    }
    if (async) {
      setTimeout(() => this.resetPan());
    } else {
      this.resetPan();
    }
  }

  swipe() {
    if (this.active) {
      this.passedThresh = true;
    }
  }
}
