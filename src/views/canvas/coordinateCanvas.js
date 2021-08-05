import { Canvas } from "./canvas";
import { Eraser } from "./eraser";
import { mergeOption, throttler } from "ifuncs";

export const CoordinateCanvas = (function() {
  let staticCoorCenter;
  let lineStyle = {
    commonLineColor: "#9e9e9e59",
    MarkLineColor: "#9e9e9eed",
    centerLineColor: "black"
  };
  let axialLineXIndex, axialLineYIndex;
  let lines;
  let rulerPoints;
  let moveOffset = [0, 0];
  let cellSize = 0;
  let ratio = [5, 1]; //5 cell equal coordinates 1
  let cc;
  let mousePointX, mousePointY;
  function CoordinateCanvas(options) {
    cc = this;
    Canvas.call(this, options);
    init(options);
  }
  CoordinateCanvas.prototype = Canvas.prototype;
  function init(options) {
    staticCoorCenter = [
      Math.round(cc.width / 2) + 0.5,
      Math.round(cc.height / 2) + 0.5
    ];
    cellSize = options.cellSize || 10;
    paint();
  }
  function paint() {
    generateLines();
    cc.eraser.erase(0, 0, cc.width, cc.height);
    lines.x.forEach(line => {
      cc.pen.drawLine(line.p1, line.p2, line.color);
    });
    lines.y.forEach(line => {
      cc.pen.drawLine(line.p1, line.p2, line.color);
    });
    paintRuler(cc);
  }

  function generateLines() {
    lines = {
      x: [],
      y: []
    };
    let x, y, color;
    for (let count = 0; ; count++) {
      y = staticCoorCenter[1] + count * cellSize + moveOffset[1];
      if (count == 0) {
        color = lineStyle.centerLineColor;
      } else if (count % 5 === 0) {
        color = lineStyle.MarkLineColor;
      } else {
        color = lineStyle.commonLineColor;
      }
      lines.x.push({
        p1: [0, y],
        p2: [cc.width, y],
        color: color
      });
      if (y >= cc.height) break;
    }
    for (let count = -1; ; count--) {
      y = staticCoorCenter[1] + count * cellSize + moveOffset[1];
      if (y <= 0) break;
      if (count % 5 === 0) {
        color = lineStyle.MarkLineColor;
      } else {
        color = lineStyle.commonLineColor;
      }
      lines.x.unshift({
        p1: [0, y],
        p2: [cc.width, y],
        color: color
      });
    }
    for (let count = 0; ; count++) {
      x = staticCoorCenter[0] + count * cellSize + moveOffset[0];
      if (count == 0) {
        color = lineStyle.centerLineColor;
      } else if (count % 5 === 0) {
        color = lineStyle.MarkLineColor;
      } else {
        color = lineStyle.commonLineColor;
      }
      lines.y.push({
        p1: [x, 0],
        p2: [x, cc.height],
        color: color
      });
      if (x >= cc.width) break;
    }
    for (let count = -1; ; count--) {
      x = staticCoorCenter[0] + count * cellSize + moveOffset[0];
      if (x <= 0) break;
      if (count % 5 === 0) {
        color = lineStyle.MarkLineColor;
      } else {
        color = lineStyle.commonLineColor;
      }
      lines.y.unshift({
        p1: [x, 0],
        p2: [x, cc.height],
        color: color
      });
    }
    axialLineXIndex = findAxialLineIndex(lines.x);
    axialLineYIndex = findAxialLineIndex(lines.y);
    generateRulerPoints();
  }

  function findAxialLineIndex(lines) {
    return lines.findIndex(line => {
      return line.color === "black";
    });
  }

  function generateRulerPoints() {
    let points = {
      x: [],
      y: []
    };
    let gap = ratio[0];
    let [ox, oy] = cc.getCoorOriginPoint();
    let unit = ratio[1];
    for (let i = axialLineYIndex - gap, count = 1; i >= 0; i -= gap, count++) {
      points.x.unshift({
        point: [lines.y[i].p1[0], oy],
        text: -unit * count
      });
    }
    for (let i = axialLineXIndex - gap, count = 1; i >= 0; i -= gap, count++) {
      points.y.unshift({
        point: [ox, lines.x[i].p1[1]],
        text: unit * count
      });
    }
    for (
      let i = axialLineYIndex, count = 0;
      i <= lines.y.length - 1;
      i += gap, count++
    ) {
      points.x.push({
        point: [lines.y[i].p1[0], oy],
        text: unit * count
      });
    }
    for (
      let i = axialLineXIndex, count = 0;
      i <= lines.x.length - 1;
      i += gap, count++
    ) {
      points.y.push({
        point: [ox, lines.x[i].p1[1]],
        text: -unit * count
      });
    }
    rulerPoints = points;
  }

  function paintRuler() {
    let xPoints = rulerPoints.x;
    let yPoints = rulerPoints.y;
    xPoints.forEach(point => {
      cc.pen.drawText(point.text, point.point);
    });
    yPoints.forEach(point => {
      cc.pen.drawText(point.text, point.point);
    });
  }

  CoordinateCanvas.prototype.refresh = function() {
    paint();
  };
  function watchMousePoint() {
    cc.canvas.addEventListener("mousemove", e => {
      mousePointX = e.offsetX;
      mousePointY = e.offsetY;
    });
  }
  CoordinateCanvas.prototype.enableScale = function(cb) {
    watchMousePoint(this);
    const handler = throttler((...rest) => {
      const [arg] = [...rest];
      let action = arg.event.wheelDelta > 0 ? "zoom" : "shrink";
      switch (action) {
        case "zoom":
          cellSize += 1;
          if (cellSize > 20) (cellSize = 10), (ratio[1] /= 2);
          moveOffset[0] =
            moveOffset[0] +
            Math.round((staticCoorCenter[0] - mousePointX) / cellSize);
          moveOffset[1] =
            moveOffset[1] +
            Math.round((staticCoorCenter[1] - mousePointY) / cellSize);
          break;
        case "shrink":
          cellSize -= 1;
          if (cellSize < 10) (cellSize = 20), (ratio[1] *= 2);
          moveOffset[0] =
            moveOffset[0] -
            Math.round((staticCoorCenter[0] - mousePointX) / cellSize);
          moveOffset[1] =
            moveOffset[1] -
            Math.round((staticCoorCenter[1] - mousePointY) / cellSize);
          break;
        default:
          break;
      }
      paint();
      cb();
    }, 0);
    this.canvas.addEventListener("mousewheel", e => {
      handler({ event: e });
    });
    return;
  };
  CoordinateCanvas.prototype.enableDrag = function(cb) {
    let startX, startY, endX, endY;
    let moveHandler = function(e) {
      (endY = e.offsetY), (endX = e.offsetX);
      let deltaY = Math.round(endY - startY),
        deltaX = Math.round(endX - startX);
      moveOffset[0] += deltaX;
      moveOffset[1] += deltaY;
      paint();
      (startX = endX), (startY = endY);
      cb();
    };
    let endHanlder = function() {
      cc.canvas.removeEventListener("mouseup", endHanlder);
      cc.canvas.removeEventListener("mousemove", moveHandler);
    };
    this.canvas.addEventListener("mousedown", e => {
      (startX = e.offsetX), (startY = e.offsetY);
      this.canvas.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", endHanlder);
    });
  };

  CoordinateCanvas.prototype.getCellSize = function() {
    return cellSize;
  };
  CoordinateCanvas.prototype.getRatio = function() {
    return ratio;
  };
  CoordinateCanvas.prototype.getCoorOriginPoint = function() {
    return [lines.y[axialLineYIndex].p1[0], lines.x[axialLineXIndex].p1[1]];
  };
  return CoordinateCanvas;
})();
