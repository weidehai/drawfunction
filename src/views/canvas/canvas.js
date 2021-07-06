import { mergeOption, throttler } from "ifuncs";
import { doEventIfOwner } from "../../util/main.js";

export const Canvas = (function() {
  function Canvas(options) {
    initOptions.call(this,options)
    this.setCanvasHeight(this.height);
    this.setCanvasWidth(this.width);
  }
  Canvas.defaultOption = {
    canvas: null,
    pen: null,
    width: 500,
    height: 500
  };
  function initOptions(options){
    options = mergeOption(options || {}, Canvas.defaultOption);
    for(let [key,value] of Object.entries(options)){
      this[key] = value
    }
  }
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
  return Canvas;
})();
