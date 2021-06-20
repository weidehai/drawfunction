export const pen = {
  init(pen) {
    this.pen = pen;
    this.eraser = pen;
  },
  setCanvas(canvas) {
    this.canvas = canvas;
  },
  setCanvasWidth(width) {
    this.canvas.width = width;
  },
  setCanvasHeight(height) {
    this.canvas.height = height;
  },
  erase(x, y, w, h) {
    this.eraser.clearRect(x, y, w, h);
  },
  drawline(point1, point2) {
    this.pen.beginPath();
    this.pen.moveTo(...point1);
    this.pen.lineTo(...point2);
    this.pen.stroke();
  },
  drawcoordinate(col, row) {
    this.erase(0, 0, this.canvas.width, this.canvas.height);
    const draw = direction => {
      const gridNums = direction === "row" ? row : col;
      const length =
        direction === "row" ? this.canvas.height : this.canvas.width;
      const midlineIndex = gridNums / 2;
      const gap = length / gridNums;
      const midlinePos = 0.5 + midlineIndex * gap;
      if (direction === "row") {
        this.canvas.originPointY = midlinePos;
      } else {
        this.canvas.originPointX = midlinePos;
      }
      for (
        let left = midlineIndex, rigth = midlineIndex, count = 0;
        rigth < gridNums && left > 0;
        rigth++, left--, count++
      ) {
        let yAxis1 = 0.5 + left * rowGap;
        let yAxis2 = 0.5 + rigth * rowGap;
        let point1,point2
        if(direction === "row"){
          point1 = [0, yAxis1]
          point2 = [500, yAxis1]
        }
        drawline([0, yAxis1], [500, yAxis1], "silver");
        drawline([0, yAxis2], [500, yAxis2], "silver");
        if (count % 5 == 0) {
          canvas.ctx.textAlign = "center";
          canvas.ctx.fillStyle = "purple";
          canvas.ctx.font = "bold 16px serif";
          canvas.ctx.fillText(-count / 5, xAxis1, midlinePos);
          canvas.ctx.fillText(count / 5, xAxis2, midlinePos);
        }
      }
      drawline([0, midlinePos], [500, midlinePos], "blue");
    };
    const drawCol = () => {
      const midlineIndex = col / 2;
      const gap = this.canvas.height / row;
      const midlinePos = 0.5 + midlineIndex * canvas.gap;
      canvas.originPointX = midlinePos;
      for (
        let left = Math.ceil(canvas.col / 2),
          rigth = Math.ceil(canvas.col / 2),
          count = 0;
        rigth < canvas.col;
        rigth++, left--, count++
      ) {
        let yAxis1 = 0.5 + left * canvas.gap;
        let yAxis2 = 0.5 + rigth * canvas.gap;
        drawline(yAxis1, yAxis1, 0, 500, "silver");
        drawline(yAxis2, yAxis2, 0, 500, "silver");
        if (count % 5 == 0) {
          canvas.ctx.textAlign = "center";
          canvas.ctx.fillStyle = "purple";
          canvas.ctx.font = "bold 16px serif";
          canvas.ctx.fillText(count / 5, midlinePos, yAxis1);
          canvas.ctx.fillText(-count / 5, midlinePos, yAxis2);
        }
      }
      this.drawline(midlinePos, midlinePos, 0, 500, "blue");
    };
    drawx();
    drawy();
  },
  enableScale() {
    const self = this;
    function isShrink(e) {
      return e.wheelDelta < 0 ? true : false;
    }
    function isZoom(e) {
      return e.wheelDelta > 0 ? true : false;
    }
    function isMaxZoom() {
      return self.canvas.col <= MAX_ZOOM;
    }
    function isMinShrink() {
      return self.canvas.col >= MIN_SHRINK;
    }
    const handler = throttler((...rest) => {
      const [arg] = [...rest];
      if (isShrink(arg.event) && !isMinShrink()) {
        self.canvas.col += 2;
        self.canvas.row += 2;
        self.canvas.gap = self.canvas.width / self.canvas.col;
      }
      if (isZoom(arg.event) && !isMaxZoom()) {
        self.canvas.col -= 2;
        self.canvas.row -= 2;
        self.canvas.gap = self.canvas.width / self.canvas.col;
      }
      self.ensureCancelrequestAnimation(self.drawcoordinate);
    }, 20);

    this.canvas.instance.addEventListener("mousewheel", function(e) {
      doEventIfOwner(this, e, handler);
    });
  },

  setPenStyle(styleObj, canvas) {
    for (let key of Object.keys(styleObj)) {
      canvas.ctx[key] = styleObj[key];
    }
  }
};
