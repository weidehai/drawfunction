import { degToarc, reliableFloatAdd, isNull, isArray } from "ifuncs";

export const PonitPloter = (function() {
  let x = null;
  let y = 0;
  let degx = 0;
  let ratio = 0;
  let _options;  //sava options
  let cartesianContext = {
    x: null,
    y: null,
    cartesianRange: null,
    cartesianStep: 0.01
  };
  let polarContext = {
    degx: 0,
    polarRange: [0, 360],
    polarStep: 1
  };
  let calculateCanvasPoint = {
    x: 0,
    y: 0,
    _x: null, //previous ponit
    _y: null //previous ponit
  };
  function PonitPloter(options) {
    this.x = null;
    this.y = 0;
    this._x = 0;
    this.realx = 0;
    this.realy = 0;
    this._realx = null;
    this._realy = null;
    this.stopPlot = false;
    this.pointCount = 0;
    this.canvas = options.canvas;
    _options = options;
    init(this,options);
  }
  function init(pp, options) {
    ratio = (pp.canvas.cellSize * pp.canvas.per) / pp.canvas.ratio;
    function initCartesianContext() {
      if (options.cartesianStep)
        cartesianContext.cartesianStep = parseFloat(options.cartesianStep);
      if (options.cartesianRange && isArray(options.cartesianRange))
        (cartesianContext.cartesianRange[0] = parseFloat(
          options.cartesianRange[0]
        )),
          (cartesianContext.cartesianRange[1] = parseFloat(
            options.cartesianRange[1]
          ));
      else
        cartesianContext.cartesianRange = [
          (0 - pp.canvas.originPointX) / ratio,
          (pp.canvas.width - pp.canvas.originPointX) / ratio
        ];
      cartesianContext.x = cartesianContext.cartesianRange[0];
    }
    function initPolarContext() {
      if (options.polarRange && isArray(options.polarRange))
        polarContext.polarRange = options.polarRange;
      if (options.polarStep)
        polarContext.polarStep = parseInt(options.polarStep);
    }
    initCartesianContext();
    initPolarContext();
  }

  PonitPloter.prototype.setExp = function(expression) {
    this.expression = expression;
  };
  PonitPloter.prototype.setPolarRange = function(range) {
    this.polarRange = range;
  };
  PonitPloter.prototype.setCartesianRange = function(range) {
    this.cartesianRange = range;
  };
  PonitPloter.prototype.polar = function() {
    let pp = this;
    this._x = parseInt(this.polarRange[0]);
    console.log(this.polarRange);
    if (!this.x) this.x = degToarc(this._x);
    for (; this._x <= parseInt(this.polarRange[1]); ) {
      console.log(1111);
      try {
        eval(this.expression);
      } catch (e) {
        throw e;
      }
      this.pointCount++;
      this.realx =
        this.canvas.originPointX +
        this.y * Math.cos(degToarc(this._x)) * this.zoom;
      this.realy =
        this.canvas.originPointY -
        this.y * Math.sin(degToarc(this._x)) * this.zoom;
      console.log(this.realy, this.realx);
      if (isInlayout(this.realx, this.realy, pp) && !this.stopPlot) {
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
      if (this.stopPlot) break;
      this._x = reliableFloatAdd(this._x, this.polarStep);
      this.x = degToarc(this._x);
    }
  };
  PonitPloter.prototype.cartesian = function() {
    let pp = this;
    ratio = (pp.canvas.cellSize * pp.canvas.per) / pp.canvas.ratio;
    let expression = this.expression
      .replace("x", "cartesianContext.x")
      .replace("y", "cartesianContext.y");
    for (; cartesianContext.x <= cartesianContext.cartesianRange[1]; ) {
      try {
        eval(expression);
      } catch (e) {
        throw e;
      }
      calculateCanvasPoint.x = this.canvas.originPointX + cartesianContext.x * ratio;
      calculateCanvasPoint.y = this.canvas.originPointY - cartesianContext.y * ratio;
      if (isInlayout(calculateCanvasPoint.x, calculateCanvasPoint.y, pp)) {
        if (!calculateCanvasPoint._x || !calculateCanvasPoint._y) {
          (calculateCanvasPoint._x = calculateCanvasPoint.x),
            (calculateCanvasPoint._y = calculateCanvasPoint.y);
        } else {
          let point1 = [calculateCanvasPoint._x, calculateCanvasPoint._y];
          let point2 = [calculateCanvasPoint.x, calculateCanvasPoint.y];
          this.canvas.pen.drawLine(point1, point2, "red");
          (calculateCanvasPoint._x = calculateCanvasPoint.x),
            (calculateCanvasPoint._y = calculateCanvasPoint.y);
        }
      } else {
        (calculateCanvasPoint._x = null),
            (calculateCanvasPoint._y = null);
      }
      cartesianContext.x = reliableFloatAdd(cartesianContext.x, cartesianContext.cartesianStep * this.canvas.ratio);
    }
  };
  function isInlayout(x, y, pp) {
    return x >= 0 && x <= pp.canvas.width && y >= 0 && y <= pp.canvas.height;
  }
  PonitPloter.prototype.refresh = function() {
    init(this,_options)
  };
  return PonitPloter;
})();
