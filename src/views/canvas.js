import { mergeOption,throttler } from "ifuncs";
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
CoordinateCanvas.prototype.addRuler = function(direction, gridNums, pre) {
  const length = direction === "row" ? this.width : this.height;
  const gap = length / gridNums;
  let offset = pre;
  let count = gridNums / pre / 2;
  while (count>0) {
    let Axis1 = this.originPointY - offset * gap;
    let Axis2 = this.originPointY + offset * gap;
    if (direction === "row") {
      this.pen.drawText(-offset / 5, [Axis1, this.originPointY]);
      this.pen.drawText(offset / 5, [Axis2, this.originPointY]);
    } else {
      this.pen.drawText(-offset / 5, [this.originPointX, Axis1]);
      this.pen.drawText(offset / 5, [this.originPointX, Axis2]);
    }
    offset += pre;
    count--;
  }
  this.pen.drawText(0, [this.originPointX, this.originPointY]);
};
CoordinateCanvas.prototype.init = function() {
  this.getEraser().erase(0, 0, this.canvas.width, this.canvas.height);
  const draw = direction => {
    const gridNums = direction === "row" ? this.row : this.col;
    const length = direction === "row" ? this.height : this.width;
    const midlineIndex = gridNums / 2;
    const gap = length / gridNums;
    const midlinePos = 0.5 + midlineIndex * gap;
    let color = "blue";
    if (direction === "row") {
      this.originPointY = midlinePos;
    } else {
      this.originPointX = midlinePos;
    }
    for (
      let left = midlineIndex, rigth = midlineIndex;
      rigth < gridNums && left > 0;
      rigth++, left--
    ) {
      let Axis1 = 0.5 + left * gap;
      let Axis2 = 0.5 + rigth * gap;
      let point1_1, point1_2, point2_1, point2_2;
      if (direction === "row") {
        point1_1 = [0, Axis1];
        point1_2 = [0, Axis2];
        point2_1 = [500, Axis1];
        point2_2 = [500, Axis2];
      } else {
        point1_1 = [Axis1, 0];
        point1_2 = [Axis2, 0];
        point2_1 = [Axis1, 500];
        point2_2 = [Axis2, 500];
      }
      this.pen.drawLine(point1_1, point2_1, color);
      this.pen.drawLine(point1_2, point2_2, color);
      color = "silver";
    }
  };
  draw("row");
  draw("col");
  this.addRuler("row", this.row, 5);
  this.addRuler("col", this.col, 5);
};
CoordinateCanvas.prototype.refresh = function(){
  this.init()
}
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
    if(isShrink(arg.event) && isMaxShrink()) return
    if(isZoom(arg.event) && isMaxZoom()) return
    if (isShrink(arg.event) && !isMaxShrink()) {
      this.col += 2;
      this.row += 2;
    }
    if (isZoom(arg.event) && !isMaxZoom()) {
      this.col -= 2;
      this.row -= 2;
    }
    console.log(this.col,this.row)
    this.init();
    cb()
  }, 20);

  this.canvas.addEventListener("mousewheel", function(e) {
    doEventIfOwner(this, e, handler);
  });
};
