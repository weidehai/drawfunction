import { mergeOption, throttler } from "ifuncs";
import { doEventIfOwner } from "../util/main.js";
export function Pen(pen) {
  this.pen = pen;
}

Pen.prototype.drawLine = function(point1, point2, color) {
  this.setLineColor(color);
  this.pen.beginPath();
  this.pen.moveTo(...point1);
  this.pen.lineTo(...point2);
  this.pen.stroke();
};
Pen.prototype.drawText = function(text, position) {
  this.setPenStyle({
    textAlign: "center",
    fillStyle: "purple",
    font: "bold 16px serif"
  });
  this.pen.fillText(text, ...position);
};
Pen.prototype.setLineColor = function(color) {
  this.setPenStyle({ strokeStyle: color });
};
Pen.prototype.setPenStyle = function(styleObj) {
  for (let key of Object.keys(styleObj)) {
    this.pen[key] = styleObj[key];
  }
};

function Eraser(eraser) {
  this.eraser = eraser.pen;
}
Eraser.prototype.erase = function(x, y, w, h) {
  this.eraser.clearRect(x, y, w, h);
};

export function Canvas(options) {
  options = options || {};
  mergeOption(options, Canvas.defaultOption);
  this.canvas = options.canvas;
  this.pen = options.pen;
  this.width = options.width;
  this.height = options.height;
  this.eraser = null;
  this.setCanvasHeight(this.height);
  this.setCanvasWidth(this.width);
}
Canvas.defaultOption = {
  canvas: null,
  pen: null,
  width: 500,
  height: 500
};
Canvas.prototype.setCanvasHeight = function(height) {
  if (!this.canvas) return;
  this.canvas.height = height;
};
Canvas.prototype.setCanvasWidth = function(width) {
  if (!this.canvas) return;
  this.canvas.width = width;
};
Canvas.prototype.setPen = function(pen) {
  this.pen = pen;
};
Canvas.prototype.getEraser = function() {
  return this.eraser || (this.eraser = new Eraser(this.pen));
};

export function CoordinateCanvas(options) {
  mergeOption(options, CoordinateCanvas.defaultOption);
  Canvas.call(this, options);
  this.row = options.row;
  this.col = options.col;
  this.maxZoom = options.maxZoom;
  this.maxShrink = options.maxShrink;
  this.midlineIndexX = this.col / 2;
  this.midlineIndexY = this.row / 2;
  this.init();
}
CoordinateCanvas.prototype = new Canvas();
CoordinateCanvas.defaultOption = {
  row: 50,
  col: 50,
  canvas: null,
  pen: null,
  width: 500,
  height: 500,
  maxZoom: 4,
  maxShrink: 100
};
CoordinateCanvas.prototype.setRow = function(row) {
  this.row = row;
};
CoordinateCanvas.prototype.setCol = function(col) {
  this.col = col;
};
CoordinateCanvas.prototype.init = function() {
  this.getEraser().erase(0, 0, this.canvas.width, this.canvas.height);
  this.drawRow();
  this.drawCol();
  this.addRowRuler(5);
  this.addColRuler(5);
};
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
CoordinateCanvas.prototype.watchMouse = function(cb) {
  let startX,
    startY,
    endX,
    endY,
    self = this;
  let moveHandler = function(e) {
    (endY = e.offsetY), (endX = e.offsetX);
    let cellWidth = self.width / self.col,
      cellHeight = self.height / self.row;
    let deltaY = endY - startY,
      deltaX = endX - startX;
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
CoordinateCanvas.prototype.drawRow = function() {
  const gridNums = this.row;
  const length = this.height;
  const midlineIndex = this.midlineIndexY;
  const gap = length / gridNums;
  const midlinePos = 0.5 + midlineIndex * gap;
  let color = "silver";
  this.originPointY = midlinePos;
  for (
    let left = gridNums / 2, rigth = gridNums / 2;
    rigth < gridNums && left > 0;
    rigth++, left--
  ) {
    let Axis1 = 0.5 + left * gap;
    let Axis2 = 0.5 + rigth * gap;
    let point1_1, point1_2, point2_1, point2_2;
    point1_1 = [0, Axis1];
    point1_2 = [0, Axis2];
    point2_1 = [this.width, Axis1];
    point2_2 = [this.width, Axis2];
    if (left === midlineIndex && rigth === midlineIndex) {
      this.pen.drawLine(point1_1, point2_1, "blue");
    } else if (rigth === midlineIndex) {
      this.pen.drawLine(point1_1, point2_1, color);
      this.pen.drawLine(point1_2, point2_2, "blue");
    } else if (left === midlineIndex) {
      this.pen.drawLine(point1_1, point2_1, "blue");
      this.pen.drawLine(point1_2, point2_2, color);
    } else {
      this.pen.drawLine(point1_1, point2_1, color);
      this.pen.drawLine(point1_2, point2_2, color);
    }
  }
};
CoordinateCanvas.prototype.drawCol = function() {
  const gridNums = this.col;
  const length = this.width;
  const midlineIndex = this.midlineIndexX;
  const gap = length / gridNums;
  const midlinePos = 0.5 + midlineIndex * gap;
  let color = "silver";
  this.originPointX = midlinePos;
  for (
    let left = gridNums / 2, rigth = gridNums / 2;
    rigth < gridNums && left > 0;
    rigth++, left--
  ) {
    let Axis1 = 0.5 + left * gap;
    let Axis2 = 0.5 + rigth * gap;
    let point1_1, point1_2, point2_1, point2_2;
    point1_1 = [Axis1, 0];
    point1_2 = [Axis2, 0];
    point2_1 = [Axis1, this.height];
    point2_2 = [Axis2, this.height];
    if (left === midlineIndex && rigth === midlineIndex) {
      this.pen.drawLine(point1_1, point2_1, "blue");
    } else if (rigth === midlineIndex) {
      this.pen.drawLine(point1_1, point2_1, color);
      this.pen.drawLine(point1_2, point2_2, "blue");
    } else if (left === midlineIndex) {
      this.pen.drawLine(point1_1, point2_1, "blue");
      this.pen.drawLine(point1_2, point2_2, color);
    } else {
      this.pen.drawLine(point1_1, point2_1, color);
      this.pen.drawLine(point1_2, point2_2, color);
    }
  }
};
CoordinateCanvas.prototype.addRowRuler = function(pre) {
  const length = this.width;
  const gap = length / this.col;
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
};
CoordinateCanvas.prototype.addColRuler = function(pre) {
  const length = this.height;
  const gap = length / this.row;
  let offset = pre;
  let position = this.midlineIndexY;
  while (position > 0) {
    let Axis1 = this.originPointY - offset * gap;
    this.pen.drawText(offset / 5, [this.originPointX,Axis1]);
    offset += pre;
    position -= pre;
  }
  position = this.midlineIndexY;
  offset = pre;
  while (position < this.row) {
    let Axis2 = this.originPointY + offset * gap;
    this.pen.drawText(-offset / 5, [this.originPointX,Axis2]);
    offset += pre;
    position += pre;
  }
};
