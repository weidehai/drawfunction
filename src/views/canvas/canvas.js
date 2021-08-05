import { Pen } from "./pen";
import { Eraser } from "./eraser";
export const Canvas = (function() {
  function Canvas(options) {
    this.canvas = options.canvas;
    this.pen = new Pen(this.canvas.getContext("2d"));
    this.eraser = new Eraser(this.pen);
    this.width = options.width;
    this.height = options.height;
    this.setCanvasHeight(this.height);
    this.setCanvasWidth(this.width);
  }
  Canvas.prototype.setCanvasHeight = function(height) {
    if (!this.canvas) return;
    this.height = height;
    this.canvas.height = height;
  };
  Canvas.prototype.setCanvasWidth = function(width) {
    if (!this.canvas) return;
    this.width = width;
    this.canvas.width = width;
  };
  Canvas.prototype.setPen = function(pen) {
    this.pen = pen;
  };
  return Canvas;
})();
