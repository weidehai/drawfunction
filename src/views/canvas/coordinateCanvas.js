import { Canvas } from "./canvas";
import { Eraser } from "./eraser";
import { mergeOption } from "ifuncs";

export const CoordinateCanvas = (function() {
  function CoordinateCanvas(options) {
    initOptions.call(this, options);
    this.init();
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
    this.bottomDrawBegin = this.height - this.cellSize + 0.5;
    this.rightDrawBegin = this.width - this.cellSize + 0.5;
    this.rowMidLine = (this.bottomDrawBegin - this.topDrawBegin) / 10;
    this.colMidLine = (this.rightDrawBegin - this.leftDrawBegin) / 10;
  }
  CoordinateCanvas.defaultOption = {
    canvas: null,
    pen: null,
    width: 500,
    height: 500,
    maxZoom: 4,
    maxShrink: 100,
    cellSize: 10
  };
  CoordinateCanvas.prototype.setRow = function(row) {
    this.row = row;
  };
  CoordinateCanvas.prototype.setCol = function(col) {
    this.col = col;
  };
  CoordinateCanvas.prototype.init = function() {
    this.setCanvasHeight(this.height);
    this.setCanvasWidth(this.width);
    this.eraser.erase(0, 0, this.width, this.height);
    if (this.leftDrawBegin <= 10.5 || this.topDrawBegin <= 10.5) {
      paintAxisLine1.call(this);
    } else {
      paintAxisLine2.call(this);
    }
    //this.addRowRuler(5);
    //this.addColRuler(5);
  };
  function paintAxisLine1() {
    function drawRowFromTop() {
      for (let count = 1; ; count++) {
        let y = this.topDrawBegin + (count - 1) * this.cellSize;
        if (y >= this.height) break;
        if (y <= 0) continue;
        let point1_1, point2_1;
        let color = "#9e9e9e59";
        if (count % 5 === 0) {
          color = "#9e9e9ed1";
        }
        point1_1 = [0, y];
        point2_1 = [this.width, y];
        this.pen.drawLine(point1_1, point2_1, color);
      }
    }
    function drawColFromLeft() {
      for (let count = 1; ; count++) {
        let x = this.leftDrawBegin + (count - 1) * this.cellSize;
        if (x >= this.width) break;
        if (x <= 0) continue;
        let point1_1, point2_1;
        let color = "#9e9e9e59";
        if (count % 5 === 0) {
          color = "#9e9e9ed1";
        }
        point1_1 = [x, 0];
        point2_1 = [x, this.height];
        this.pen.drawLine(point1_1, point2_1, color);
      }
    }
    drawRowFromTop.call(this);
    drawColFromLeft.call(this);
  }
  function paintAxisLine2() {
    function drawRowFromBottom() {
      for (let count = 1; ; count++) {
        let y = this.bottomDrawBegin - (count - 1) * this.cellSize;
        if (y <= 0) break;
        if (y >= this.height) continue;
        let point1_1, point2_1;
        let color = "#9e9e9e59";
        if (count % 5 === 0) {
          color = "#9e9e9ed1";
        }
        point1_1 = [0, y];
        point2_1 = [this.width, y];
        this.pen.drawLine(point1_1, point2_1, color);
      }
    }
    function drawColFromRight() {
      for (let count = 1; ; count++) {
        let x = this.rightDrawBegin - (count - 1) * this.cellSize;
        if (x <= 0) break;
        if (x >= this.width) continue;
        let point1_1, point2_1;
        let color = "#9e9e9e59";
        if (count % 5 === 0) {
          color = "#9e9e9ed1";
        }
        point1_1 = [x, 0];
        point2_1 = [x, this.height];
        this.pen.drawLine(point1_1, point2_1, color);
      }
    }
    drawRowFromBottom.call(this);
    drawColFromRight.call(this);
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
    this.init();
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
      let cellWidth = self.width / self.col,
        cellHeight = self.height / self.row;
      let deltaY = Math.round(endY - startY),
        deltaX = Math.round(endX - startX);
      self.topDrawBegin = self.topDrawBegin + deltaY;
      self.leftDrawBegin = self.leftDrawBegin + deltaX;
      self.bottomDrawBegin = self.bottomDrawBegin + deltaY;
      self.rightDrawBegin = self.rightDrawBegin + deltaX;
      let cellX = Math.round(deltaX / cellWidth),
        cellY = Math.round(deltaY / cellHeight);
      (self.midlineIndexX += cellX), (self.midlineIndexY += cellY);
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
