import { degToarc, reliableFloatAdd, mergeOption, isNull } from "ifuncs";

export function PonitPloter(options) {
  mergeOption(options, PonitPloter.defaultOption);
  this.x = null;
  this.y = 0;
  this._x = 0;
  this.realx = 0;
  this.realy = 0;
  this._realx = null;
  this._realy = null;
  this.frame = null;
  this.stopPlot = false;
  this.pointCount = 0;
  this.step = options.step;
  this.zoom = options.zoom;
  this.canvas = options.canvas;
  this.polarRange = options.polarRange;
  this.polarStep = options.polarStep;
  this.cartesianStep = options.cartesianStep;
  this.cartesianRange = options.cartesianRange;
  this.enableAnimation = options.enableAnimation;
  this.animationSpeed = options.animationSpeed;
}
PonitPloter.defaultOption = {
  canvas: null,
  zoom: 50,
  polarRange: [0, 360],
  polarStep: 1,
  cartesianRange: null,
  cartesianStep: 0.01,
  enableAnimation: false,
  animationSpeed: 0
};
PonitPloter.prototype.setExp = function(expression) {
  this.expression = expression.replace("x", "this.x").replace("y", "this.y");
};
PonitPloter.prototype.setPolarRange = function(range) {
  this.polarRange = range;
};
PonitPloter.prototype.setCartesianRange = function(range) {
  this.cartesianRange = range;
};
PonitPloter.prototype.polar = function() {
  try {
    eval(this.expression);
  } catch (e) {
    throw e;
  }
  this.pointCount++;
  this.realx =
    this.canvas.originPointX + this.y * Math.cos(degToarc(this._x)) * this.zoom;
  this.realy =
    this.canvas.originPointY - this.y * Math.sin(degToarc(this._x)) * this.zoom;
  if (this.isInlayout(this.realx, this.realy) && !this.stopPlot) {
    if (!this._realx || !this._realy) {
      (this._realx = this.realx), (this._realy = this.realy);
    } else {
      let point1 = [this._realx, this._realy];
      let point2 = [this.realx, this.realy];
      this.canvas.pen.drawLine(point1, point2, "red");
      (this._realx = this.realx), (this._realy = this.realy);
    }
  } else {
    (this._realx = null), (this._realy = null);
  }
  if (
    this._x >= this.polarRange[0] &&
    this._x <= this.polarRange[1] &&
    !this.stopPlot
  ) {
    this._x = reliableFloatAdd(this._x, this.polarStep);
    this.x = degToarc(this._x);
    if (!this.enableAnimation || this.animationSpeed <= 0) {
      this.polar();
    } else {
      if (!this.frame) this.frame = this.calculateFrame();
      if (pointCount % this.frame === 0) {
        requestAnimationFrame(() => {
          this.polar();
        });
      } else {
        this.polar();
      }
    }
  }
};
PonitPloter.prototype.cartesian = function() {
  if (isNull(this.x)) {
    this.x = -this.canvas.originPointX / this.zoom;
    console.log(this.x);
  }
  try {
    eval(this.expression);
  } catch (e) {
    throw e;
  }
  this.pointCount++;
  this.realx = this.canvas.originPointX + this.x * this.zoom;
  this.realy = this.canvas.originPointY - this.y * this.zoom;
  if (this.isInlayout(this.realx, this.realy) && !this.stopPlot) {
    if (!this._realx || !this._realy) {
      (this._realx = this.realx), (this._realy = this.realy);
    } else {
      let point1 = [this._realx, this._realy];
      let point2 = [this.realx, this.realy];
      this.canvas.pen.drawLine(point1, point2, "red");
      (this._realx = this.realx), (this._realy = this.realy);
    }
  } else {
    (this._realx = null), (this._realy = null);
  }
  if (!this.cartesianRange) this.cartesianRange = [0, this.canvas.width];
  if (
    this.realx >= this.cartesianRange[0] &&
    this.realx <= this.cartesianRange[1] &&
    !this.stopPlot
  ) {
    this.x = reliableFloatAdd(this.x, this.cartesianStep);
    if (!this.enableAnimation || this.animationSpeed <= 0) {
      this.cartesian();
    } else {
      if (!this.frame) this.frame = this.calculateFrame();
      if (pointCount % this.frame === 0) {
        requestAnimationFrame(() => {
          this.cartesian();
        });
      } else {
        this.cartesian();
      }
    }
  }
};
PonitPloter.prototype.isInlayout = function(x, y) {
  return x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height;
};
PonitPloter.prototype.calculateFrame = function() {
  let frame = this.animationSpeed * 60;
  point = point || distance / (step * this.zoom);
  return Math.ceil(point / frame);
};
PonitPloter.prototype.ensureStopAllPlot = function(cb) {
  if (this.stopPlot) return cb();
  this.stopPlot = true;
  setTimeout(() => {
    this.stopPlot = false;
    cb();
  }, 200);
};
PonitPloter.prototype.refresh = function() {
  this.x = null;
  this.y = 0;
  this._x = 0;
  this.realx = 0;
  this.realy = 0;
  this._realx = null;
  this._realy = null;
  this.frame = null;
  this.stopPlot = false;
  this.pointCount = 0;
};
