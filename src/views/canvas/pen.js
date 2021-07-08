export const Pen = (function() {
  function Pen(pen) {
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
      fillStyle: "black",
      font: "13px serif"
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
  return Pen
})();
