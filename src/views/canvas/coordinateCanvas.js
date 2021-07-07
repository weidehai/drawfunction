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
    this.lines = null;
  }
  CoordinateCanvas.defaultOption = {
    canvas: null,
    pen: null,
    width: 500,
    height: 500,
    maxZoom: 4,
    maxShrink: 100,
    cellSize: 10,
    lineColor:'#9e9e9e59',
    MarkLineColor:'#9e9e9eed',
    centerLineColor:'black',
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
    cc.paint((cc.lines = genarateLines(cc)));
    //this.addRowRuler(5);
    //this.addColRuler(5);
  }
  CoordinateCanvas.prototype.paint = function() {
    this.eraser.erase(0, 0, this.width, this.height);
    this.lines.x.forEach(line => {
      this.pen.drawLine(line.p1, line.p2, line.color);
    });
    this.lines.y.forEach(line => {
      this.pen.drawLine(line.p1, line.p2, line.color);
    });
  };
  function genarateLines(cc) {
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
    lines.x[(Math.floor(lines.x.length / 5) / 2) * 5 - 1].color = cc.centerLineColor;
    lines.y[(Math.floor(lines.y.length / 5) / 2) * 5 - 1].color = cc.centerLineColor;
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
      let markLineIndex = findHeadMarkLineIndex(cc.lines.y)
      while(markLineIndex>=5){
        markLineIndex-=5
        cc.lines.y[markLineIndex].color = cc.MarkLineColor
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
      let markLineIndex = findTailMarkLineIndex(cc.lines.y)
      while(markLineIndex<cc.lines.y.length-5){
        markLineIndex+=5
        cc.lines.y[markLineIndex].color = cc.MarkLineColor
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
      let markLineIndex = findHeadMarkLineIndex(cc.lines.x)
      while(markLineIndex>=5){
        markLineIndex-=5
        cc.lines.x[markLineIndex].color = cc.MarkLineColor
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
      let markLineIndex = findTailMarkLineIndex(cc.lines.x)
      while(markLineIndex<cc.lines.x.length-5){
        markLineIndex+=5
        cc.lines.x[markLineIndex].color = cc.MarkLineColor
      }
    }
  }

  function findHeadMarkLineIndex(lines){
    return lines.findIndex(line=>{
      return line.color === '#9e9e9eed'
    })
  }
  function findTailMarkLineIndex(lines){
    let index = lines.reverse().findIndex(line=>{
      return line.color === '#9e9e9eed'
    })
    lines.reverse()
    return lines.length-1-index
  }

  function paintRuler() {
    function paintRuler1() {
      let pre = 5;
      let offset = pre;
      let position = this.midlineIndexX;
      while (position > 0) {
        let Axis1 = this.originPointX - offset * gap;
        this.pen.drawText(-offset / 5, [Axis1, this.originPointY]);
        offset += pre;
        position -= pre;
      }
      position = this.midlineIndexX;
      offset = pre;
      while (position < this.col) {
        let Axis2 = this.originPointX + offset * gap;
        this.pen.drawText(offset / 5, [Axis2, this.originPointY]);
        offset += pre;
        position += pre;
      }
      this.pen.drawText(0, [this.originPointX, this.originPointY]);
    }
    function paintRuler2() {
      const length = this.height;
      const gap = length / this.row;
      let offset = pre;
      let position = this.midlineIndexY;
      while (position > 0) {
        let Axis1 = this.originPointY - offset * gap;
        this.pen.drawText(offset / 5, [this.originPointX, Axis1]);
        offset += pre;
        position -= pre;
      }
      position = this.midlineIndexY;
      offset = pre;
      while (position < this.row) {
        let Axis2 = this.originPointY + offset * gap;
        this.pen.drawText(-offset / 5, [this.originPointX, Axis2]);
        offset += pre;
        position += pre;
      }
    }
    paintRuler1.call(this);
    paintRuler2.call(this);
  }

  CoordinateCanvas.prototype.refresh = function() {
    this.paint();
  };
  CoordinateCanvas.prototype.enableScale = function(cb) {
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
      self = this;
    let moveHandler = function(e) {
      (endY = e.offsetY), (endX = e.offsetX);
      let deltaY = Math.round(endY - startY),
        deltaX = Math.round(endX - startX);
      moveLines(deltaX, deltaY, self);
      self.topDrawBegin = self.topDrawBegin + deltaY;
      self.leftDrawBegin = self.leftDrawBegin + deltaX;
      self.bottomDrawBegin = self.bottomDrawBegin + deltaY;
      self.rightDrawBegin = self.rightDrawBegin + deltaX;
      (startX = endX), (startY = endY);
      cb();
    };
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
  return CoordinateCanvas;
})();
