import { Canvas } from "./canvas";
import { Eraser } from "./eraser";
import { mergeOption } from "ifuncs";

export const CoordinateCanvas = (function() {
  function CoordinateCanvas(options) {
    let cc = this;
    initOptions.call(this, options);
    init(cc);
  }
  CoordinateCanvas.prototype = new Canvas();
  function initOptions(options) {
    options = mergeOption(options || {}, CoordinateCanvas.defaultOption);
    for (let [key, value] of Object.entries(options)) {
      this[key] = value;
    }
    this.eraser = new Eraser(this.pen);
    this.leftDrawBegin = this.cellSize + 0.5;
    this.topDrawBegin = this.cellSize + 0.5;
    this.bottomDrawBegin = null;
    this.rightDrawBegin = null;
    this.originPointX = null;
    this.originPointY = null;
    this.lines = null;
    this.rulerPoints = null;
    this.moving = false;
    this.ratio = 5;
    this.scale = 0;
  }
  CoordinateCanvas.defaultOption = {
    canvas: null,
    pen: null,
    width: 500,
    height: 500,
    maxZoom: 4,
    maxShrink: 100,
    cellSize: 10,
    lineColor: "#9e9e9e59",
    MarkLineColor: "#9e9e9eed",
    centerLineColor: "black"
  };
  CoordinateCanvas.prototype.setRow = function(row) {
    this.row = row;
  };
  CoordinateCanvas.prototype.setCol = function(col) {
    this.col = col;
  };
  function init(cc) {
    cc.setCanvasHeight(cc.height);
    cc.setCanvasWidth(cc.width);
    cc.paint((cc.lines = generateLines(cc)));
  }
  CoordinateCanvas.prototype.paint = function() {
    let cc = this;
    this.eraser.erase(0, 0, this.width, this.height);
    this.lines.x.forEach(line => {
      this.pen.drawLine(line.p1, line.p2, line.color);
    });
    this.lines.y.forEach(line => {
      this.pen.drawLine(line.p1, line.p2, line.color);
    });
    paintRuler(cc);
  };
  function generateLines(cc) {
    let lines = {
      x: [],
      y: []
    };
    let x, y, color;
    for (let count = 1; ; count++) {
      y = cc.topDrawBegin + (count - 1) * cc.cellSize;
      if (y >= cc.height) break;
      if (y <= 0) continue;
      color = cc.lineColor;
      if (count % 5 === 0) {
        color = cc.MarkLineColor;
      }
      lines.x.push({
        p1: [0, y],
        p2: [cc.width, y],
        color: color
      });
    }
    for (let count = 1; ; count++) {
      x = cc.leftDrawBegin + (count - 1) * cc.cellSize;
      if (x >= cc.width) break;
      if (x <= 0) continue;
      color = cc.lineColor;
      if (count % 5 === 0) {
        color = cc.MarkLineColor;
      }
      lines.y.push({
        p1: [x, 0],
        p2: [x, cc.height],
        color: color
      });
    }
    let midXIndex = Math.floor(lines.x.length / 5 / 2) * 5 - 1;
    let midYIndex = Math.floor(lines.y.length / 5 / 2) * 5 - 1;
    (cc.midXIndex = midXIndex), (cc.midYIndex = midYIndex);
    lines.x[midXIndex].color = cc.centerLineColor;
    lines.y[midYIndex].color = cc.centerLineColor;
    generateRulerPoints(lines, cc);
    (cc.originPointY = lines.x[midXIndex].p1[1]),
      (cc.originPointX = lines.y[midYIndex].p1[0]),
      (cc.leftEdge = lines.y[0].p1[0]),
      (cc.rightEdge = lines.y[lines.y.length - 1].p1[0]),
      (cc.topEdge = lines.x[0].p1[1]),
      (cc.bottomEdge = lines.x[lines.x.length - 1].p1[1]);
    return lines;
  }

  function generateLines2(cc) {
    let lines = {
      x: [],
      y: []
    };
    let x, y, color;
    for (let count = 1; ; count++) {
      y = cc.topDrawBegin + (count - 1) * cc.cellSize;
      if (y >= cc.height) break;
      if (y <= 0) continue;
      color = cc.lineColor;
      if (count % 5 === 0) {
        color = cc.MarkLineColor;
      }
      lines.x.push({
        p1: [0, y],
        p2: [cc.width, y],
        color: color
      });
    }
    for (let count = 1; ; count++) {
      x = cc.leftDrawBegin + (count - 1) * cc.cellSize;
      if (x >= cc.width) break;
      if (x <= 0) continue;
      color = cc.lineColor;
      if (count % 5 === 0) {
        color = cc.MarkLineColor;
      }
      lines.y.push({
        p1: [x, 0],
        p2: [x, cc.height],
        color: color
      });
    }
    let midXIndex = Math.floor(lines.x.length / 5 / 2) * 5 - 1;
    let midYIndex = Math.floor(lines.y.length / 5 / 2) * 5 - 1;
    (cc.midXIndex = midXIndex), (cc.midYIndex = midYIndex);
    lines.x[midXIndex].color = cc.centerLineColor;
    lines.y[midYIndex].color = cc.centerLineColor;
    console.log(lines.x[midXIndex]);
    generateRulerPoints(lines, cc);
    (cc.originPointY = lines.x[midXIndex].p1[1]),
      (cc.originPointX = lines.y[midYIndex].p1[0]),
      (cc.leftEdge = lines.y[0].p1[0]),
      (cc.rightEdge = lines.y[lines.y.length - 1].p1[0]),
      (cc.topEdge = lines.x[0].p1[1]),
      (cc.bottomEdge = lines.x[lines.x.length - 1].p1[1]);
    return lines;
  }

  function moveLines(offsetX, offsetY, cc) {
    let lines = cc.lines;
    lines.x.forEach(line => {
      line.p1[1] = line.p1[1] + offsetY;
      line.p2[1] = line.p2[1] + offsetY;
    });
    lines.y.forEach(line => {
      line.p1[0] = line.p1[0] + offsetX;
      line.p2[0] = line.p2[0] + offsetX;
    });
    cc.originPointX += offsetX;
    cc.originPointY += offsetY;
    complementLines(cc);
  }
  function complementLines(cc) {
    let leftEdge = cc.lines.y[0].p1[0],
      rightEdge = cc.lines.y[cc.lines.y.length - 1].p1[0],
      topEdge = cc.lines.x[0].p1[1],
      bottomEdge = cc.lines.x[cc.lines.x.length - 1].p1[1];
    let x, y, color;
    for (let count = 1; leftEdge > cc.leftEdge; count++) {
      x = leftEdge = leftEdge - cc.cellSize;
      color = cc.lineColor;
      cc.lines.y.unshift({
        p1: [x, 0],
        p2: [x, cc.height],
        color: color
      });
      let markLineIndex = findHeadMarkLineIndex(cc.lines.y);
      while (markLineIndex >= 5) {
        markLineIndex -= 5;
        cc.lines.y[markLineIndex].color = cc.MarkLineColor;
      }
    }
    for (let count = 1; rightEdge < cc.rightEdge; count++) {
      x = rightEdge = rightEdge + cc.cellSize;
      color = cc.lineColor;

      cc.lines.y.push({
        p1: [x, 0],
        p2: [x, cc.height],
        color: color
      });
      let markLineIndex = findTailMarkLineIndex(cc.lines.y);
      while (markLineIndex < cc.lines.y.length - 5) {
        markLineIndex += 5;
        cc.lines.y[markLineIndex].color = cc.MarkLineColor;
      }
    }
    for (let count = 1; topEdge > cc.topEdge; count++) {
      y = topEdge = topEdge - cc.cellSize;
      color = cc.lineColor;
      cc.lines.x.unshift({
        p1: [0, y],
        p2: [cc.width, y],
        color: color
      });
      let markLineIndex = findHeadMarkLineIndex(cc.lines.x);
      while (markLineIndex >= 5) {
        markLineIndex -= 5;
        cc.lines.x[markLineIndex].color = cc.MarkLineColor;
      }
    }
    for (let count = 1; bottomEdge < cc.bottomEdge; count++) {
      y = bottomEdge = bottomEdge + cc.cellSize;
      color = cc.lineColor;
      cc.lines.x.push({
        p1: [0, y],
        p2: [cc.width, y],
        color: color
      });
      let markLineIndex = findTailMarkLineIndex(cc.lines.x);
      while (markLineIndex < cc.lines.x.length - 5) {
        markLineIndex += 5;
        cc.lines.x[markLineIndex].color = cc.MarkLineColor;
      }
    }
  }

  function findHeadMarkLineIndex(lines) {
    return lines.findIndex(line => {
      return line.color === "#9e9e9eed";
    });
  }
  function findTailMarkLineIndex(lines) {
    let index = lines.reverse().findIndex(line => {
      return line.color === "#9e9e9eed";
    });
    lines.reverse();
    return lines.length - 1 - index;
  }

  function findBlackLineIndex(lines) {
    return lines.findIndex(line => {
      return line.color === "black";
    });
  }

  function generateRulerPoints(lines, cc) {
    let points = {
      x: [],
      y: []
    };
    let midYIndex = findBlackLineIndex(lines.y);
    let midXIndex = findBlackLineIndex(lines.x);
    let mx = lines.y[midYIndex].p1[0],
      my = lines.x[midXIndex].p1[1];
    let coordXValue = -1,
      coordYValue = -1;
    for (let i = midYIndex - 5; i >= 0; i -= 5) {
      points.x.unshift({
        point: [lines.y[i].p1[0], my],
        text: coordXValue--
      });
    }
    for (let i = midXIndex - 5; i >= 0; i -= 5) {
      points.y.unshift({
        point: [mx, lines.x[i].p1[1]],
        text: coordYValue--
      });
    }
    (coordXValue = 0), (coordYValue = 0);
    for (let i = midYIndex; i <= lines.y.length - 1; i += 5) {
      points.x.push({
        point: [lines.y[i].p1[0], my],
        text: coordXValue++
      });
    }
    for (let i = midXIndex; i <= lines.x.length - 1; i += 5) {
      points.y.push({
        point: [mx, lines.x[i].p1[1]],
        text: coordYValue++
      });
    }
    cc.rulerPoints = points;
    return points;
  }

  function paintRuler(cc) {
    let xPoints = cc.rulerPoints.x;
    let yPoints = cc.rulerPoints.y;
    xPoints.forEach(point => {
      cc.pen.drawText(point.text, point.point);
    });
    yPoints.forEach(point => {
      cc.pen.drawText(point.text, point.point);
    });
  }

  function updateRulerPoints(offsetX, offsetY, cc) {
    let xPoints = cc.rulerPoints.x;
    let yPoints = cc.rulerPoints.y;
    xPoints.forEach(point => {
      point.point[0] = point.point[0] + offsetX;
      point.point[1] = point.point[1] + offsetY;
    });
    yPoints.forEach(point => {
      point.point[0] = point.point[0] + offsetX;
      point.point[1] = point.point[1] + offsetY;
    });
    complementRulerPoints(cc);
  }

  function complementRulerPoints(cc) {
    let my = cc.rulerPoints.x[cc.rulerPoints.x.length - 1].point[1];
    let mx = cc.rulerPoints.y[cc.rulerPoints.y.length - 1].point[0];
    let rightEdge = cc.rulerPoints.x[cc.rulerPoints.x.length - 1].point[0],
      rightEdgeText = cc.rulerPoints.x[cc.rulerPoints.x.length - 1].text;
    let leftEdge = cc.rulerPoints.x[0].point[0],
      leftEdgeText = cc.rulerPoints.x[0].text;
    let bottomEdge = cc.rulerPoints.y[cc.rulerPoints.y.length - 1].point[1],
      bottomEdgeText = cc.rulerPoints.y[cc.rulerPoints.y.length - 1].text;
    let topEdge = cc.rulerPoints.y[0].point[1],
      topEdgeText = cc.rulerPoints.y[0].text;
    for (
      let text = rightEdgeText + 1;
      rightEdge < cc.rightEdge - cc.cellSize * 5;
      text++
    ) {
      cc.rulerPoints.x.push({
        point: [(rightEdge += cc.cellSize * 5), my],
        text
      });
    }
    for (
      let text = leftEdgeText - 1;
      leftEdge > cc.leftEdge + cc.cellSize * 5;
      text--
    ) {
      cc.rulerPoints.x.unshift({
        point: [(leftEdge -= cc.cellSize * 5), my],
        text
      });
    }
    for (
      let text = bottomEdgeText + 1;
      bottomEdge < cc.bottomEdge - cc.cellSize * 5;
      text++
    ) {
      cc.rulerPoints.y.push({
        point: [mx, (bottomEdge += cc.cellSize * 5)],
        text
      });
    }
    for (
      let text = topEdgeText - 1;
      topEdge > cc.topEdge + cc.cellSize * 5;
      text--
    ) {
      cc.rulerPoints.y.unshift({
        point: [mx, (topEdge -= cc.cellSize * 5)],
        text
      });
    }
  }

  CoordinateCanvas.prototype.refresh = function() {
    this.paint();
  };
  CoordinateCanvas.prototype.enableScale = function(cb) {
    this.canvas.addEventListener("mousewheel", e => {
      let action = e.wheelDelta > 0 ? "zoom" : "shrink";
      switch (action) {
        case "zoom":
          this.cellSize += 1;
          this.leftDrawBegin = this.cellSize + 0.5;
          this.topDrawBegin = this.cellSize + 0.5;
          break;
        case "shrink":
          this.cellSize -= 1;
          this.leftDrawBegin = this.cellSize + 0.5;
          this.topDrawBegin = this.cellSize + 0.5;
          break;
        default:
          break;
      }
      this.paint((this.lines = generateLines(this)));
    });
    return;
    const self = this;
    function isShrink(e) {
      return e.wheelDelta < 0 ? true : false;
    }
    function isZoom(e) {
      return e.wheelDelta > 0 ? true : false;
    }
    function isMaxZoom() {
      return self.col <= self.maxZoom;
    }
    function isMaxShrink() {
      return self.col >= self.maxShrink;
    }
    const handler = throttler((...rest) => {
      const [arg] = [...rest];
      if (isShrink(arg.event) && isMaxShrink()) return;
      if (isZoom(arg.event) && isMaxZoom()) return;
      if (isShrink(arg.event) && !isMaxShrink()) {
        this.col += 2;
        this.row += 2;
      }
      if (isZoom(arg.event) && !isMaxZoom()) {
        this.col -= 2;
        this.row -= 2;
      }
      this.init();
      cb();
    }, 20);

    this.canvas.addEventListener("mousewheel", function(e) {
      doEventIfOwner(this, e, handler);
    });
  };
  CoordinateCanvas.prototype.enableDrag = function(cb) {
    let startX,
      startY,
      endX,
      endY,
      self = this,
      cc = this;
    let moveHandler = addMoveState(function(e) {
      (endY = e.offsetY), (endX = e.offsetX);
      let deltaY = Math.round(endY - startY),
        deltaX = Math.round(endX - startX);
      moveLines(deltaX, deltaY, self);
      updateRulerPoints(deltaX, deltaY, self);
      self.topDrawBegin = self.topDrawBegin + deltaY;
      self.leftDrawBegin = self.leftDrawBegin + deltaX;
      self.bottomDrawBegin = self.bottomDrawBegin + deltaY;
      self.rightDrawBegin = self.rightDrawBegin + deltaX;
      (startX = endX), (startY = endY);
      cb();
    }, cc);
    let endHanlder = function() {
      self.canvas.removeEventListener("mouseup", endHanlder);
      self.canvas.removeEventListener("mousemove", moveHandler);
    };
    this.canvas.addEventListener("mousedown", e => {
      (startX = e.offsetX), (startY = e.offsetY);
      this.canvas.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", endHanlder);
    });
  };
  function addMoveState(fn, cc) {
    return function() {
      cc.moving = true;
      fn(...arguments);
    };
  }
  return CoordinateCanvas;
})();
