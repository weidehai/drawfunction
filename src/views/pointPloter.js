import { degToarc, reliableFloatAdd, isArray } from "ifuncs";

export const PonitPloter = (function() {
  let ratio = -1; // 1 on coordinate axis representative ${ratio} on canvas
  let _options; //sava options
  let cartesianContext = {
    x: null,
    y: null,
    cartesianRange: null,
    cartesianStep: 0.01
  };
  let polarContext = {
    degVariable: 0,
    x: 0,
    y: 0,
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
    this.canvas = options.canvas;
    _options = options;
    init(this, options);
  }
  function init(pp, options) {
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
          (0 - pp.canvas.getCoorOriginPoint()[0]) / ratio,
          (pp.canvas.width - pp.canvas.getCoorOriginPoint()[0]) / ratio
        ];
      cartesianContext.x = cartesianContext.cartesianRange[0];
    }
    function initPolarContext() {
      if (options.polarRange && isArray(options.polarRange))
        polarContext.polarRange = options.polarRange;
      if (options.polarStep)
        polarContext.polarStep = parseInt(options.polarStep);
    }
    function initCalculateCanvasPoint() {
      calculateCanvasPoint = {
        x: 0,
        y: 0,
        _x: null,
        _y: null
      };
    }
    initCartesianContext();
    initPolarContext();
    initCalculateCanvasPoint();
  }

  PonitPloter.prototype.setExp = function(expression) {
    this.expression = expression;
  };
  PonitPloter.prototype.setPolarRange = function(range) {
    _options.polarRange = range;
  };
  PonitPloter.prototype.setCartesianRange = function(range) {
    _options.cartesianRange = range;
  };
  PonitPloter.prototype.polar = function() {
    let pp = this;
    let [originPointX, originPointY] = this.canvas.getCoorOriginPoint();
    ratio =
      (pp.canvas.getCellSize() * pp.canvas.getRatio()[0]) /
      pp.canvas.getRatio()[1];
    let expression = this.expression
      .replace("x", "polarContext.x")
      .replace("y", "polarContext.y");
    polarContext.degVariable = parseFloat(polarContext.polarRange[0]);
    polarContext.x = degToarc(polarContext.degVariable);
    for (
      ;
      polarContext.degVariable <= parseFloat(polarContext.polarRange[1]);

    ) {
      try {
        eval(expression);
      } catch (e) {
        throw e;
      }
      calculateCanvasPoint.x =
        originPointX + polarContext.y * Math.cos(polarContext.x) * ratio;
      calculateCanvasPoint.y =
        originPointY - polarContext.y * Math.sin(polarContext.x) * ratio;
      if (isInlayout(calculateCanvasPoint.x, calculateCanvasPoint.y, pp)) {
        drawIfInNeed(pp);
      } else {
        (calculateCanvasPoint._x = null), (calculateCanvasPoint._y = null);
      }
      polarContext.degVariable = reliableFloatAdd(
        polarContext.degVariable,
        polarContext.polarStep
      );
      polarContext.x = degToarc(polarContext.degVariable);
    }
  };
  PonitPloter.prototype.cartesian = function() {
    let pp = this;
    let [originPointX, originPointY] = this.canvas.getCoorOriginPoint();
    ratio =
      (pp.canvas.getCellSize() * pp.canvas.getRatio()[0]) /
      pp.canvas.getRatio()[1];
    let expression = this.expression
      .replace("x", "cartesianContext.x")
      .replace("y", "cartesianContext.y");
    for (; cartesianContext.x <= cartesianContext.cartesianRange[1]; ) {
      try {
        eval(expression);
      } catch (e) {
        throw e;
      }
      calculateCanvasPoint.x = originPointX + cartesianContext.x * ratio;
      calculateCanvasPoint.y = originPointY - cartesianContext.y * ratio;
      if (isInlayout(calculateCanvasPoint.x, calculateCanvasPoint.y, pp)) {
        drawIfInNeed(pp);
      } else {
        (calculateCanvasPoint._x = null), (calculateCanvasPoint._y = null);
      }
      cartesianContext.x = reliableFloatAdd(
        cartesianContext.x,
        cartesianContext.cartesianStep * pp.canvas.getRatio()[1]
      );
    }
  };
  function drawIfInNeed(pp) {
    if (!calculateCanvasPoint._x || !calculateCanvasPoint._y) {
      (calculateCanvasPoint._x = calculateCanvasPoint.x),
        (calculateCanvasPoint._y = calculateCanvasPoint.y);
    } else {
      let point1 = [calculateCanvasPoint._x, calculateCanvasPoint._y];
      let point2 = [calculateCanvasPoint.x, calculateCanvasPoint.y];
      pp.canvas.pen.drawLine(point1, point2, "red");
      (calculateCanvasPoint._x = calculateCanvasPoint.x),
        (calculateCanvasPoint._y = calculateCanvasPoint.y);
    }
  }
  function isInlayout(x, y, pp) {
    return x >= 0 && x <= pp.canvas.width && y >= 0 && y <= pp.canvas.height;
  }
  PonitPloter.prototype.refresh = function() {
    init(this, _options);
  };
  return PonitPloter;
})();
