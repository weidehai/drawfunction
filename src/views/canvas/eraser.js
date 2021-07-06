export const Eraser = (function() {
  function Eraser(eraser) {
    this.eraser = eraser.pen;
  }
  Eraser.prototype.erase = function(x, y, w, h) {
    this.eraser.clearRect(x, y, w, h);
  };
  return Eraser
})();
