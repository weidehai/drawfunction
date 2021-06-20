export function polar(expression) {
  let x = 0,
    y = 0,
    _x = 0,
    step=1,
    realx = 0,
    realy = 0,
    _realy = null,
    _realx = null,
    self = this,
    frame = this.calculateFrame(step, null, 360),
    pointCount = 0;
  doWork();
  function doWork() {
    try {
      eval(expression);
    } catch (e) {
      self.tipsComeIn({ message: e.message, title: "错误提示" });
      return;
    }
    pointCount++;
    realx =
      self.canvas.originPointX +
      y * Math.cos((Math.PI * 2 * _x) / 360) * self.canvas.zoom;
    realy =
      self.canvas.originPointX -
      y * Math.sin((Math.PI * 2 * _x) / 360) * self.canvas.zoom;
    if (self.isInlayout(realx, realy) && !self.stopAction) {
      if (!_realx || !realy) {
        (_realx = realx), (_realy = realy);
      } else {
        self.canvas.ctx.beginPath();
        self.canvas.ctx.moveTo(_realx, _realy);
        self.canvas.ctx.lineTo(realx, realy);
        self.canvas.ctx.stroke();
        (_realx = realx), (_realy = realy);
      }
    } else {
      (_realx = null), (_realx = null);
    }
    if (_x >= 0 && _x <= 360 && !self.stopAction) {
      _x = reliableFloatAdd(_x, step);
      x = Math.PI*_x/180
      if (!self.enableAnimation) {
        doWork();
      } else {
        if (pointCount % frame === 0) {
          requestAnimationFrame(() => {
            doWork();
          });
        } else {
          doWork();
        }
      }
    }
  }
}
export function cartesian(expression) {
  let x =(10.5-this.canvas.originPointX)/this.canvas.zoom,
    y = 0,
    realx = 0,
    step=0.01,
    realy = 0,
    _realy = null,
    _realx = null,
    self = this,
    frame = this.calculateFrame(step, 480),
    pointCount = 0;
  function doWork() {
    try {
      eval(expression);
    } catch (e) {
      self.tipsComeIn({ message: e.message, title: "错误提示" });
      return;
    }
    pointCount++;
    realx = self.canvas.originPointX + x * self.canvas.zoom;
    realy = self.canvas.originPointX - y * self.canvas.zoom;
    if (self.isInlayout(realx, realy) && !self.stopAction) {
      if (!_realx || !realy) {
        (_realx = realx), (_realy = realy);
      } else {
        self.canvas.ctx.beginPath();
        self.canvas.ctx.moveTo(_realx, _realy);
        self.canvas.ctx.lineTo(realx, realy);
        self.canvas.ctx.stroke();
        (_realx = realx), (_realy = realy);
      }
    } else {
      (_realx = null), (_realx = null);
    }
    if (realx >= 10.5 && realx <= 490.5 && !self.stopAction) {
      x = reliableFloatAdd(x, step);
      if (!self.enableAnimation) {
        doWork();
      } else {
        if (pointCount % frame === 0) {
          requestAnimationFrame(() => {
            doWork();
          });
        } else {
          doWork();
        }
      }
    }
  }
  return doWork
}


function isInlayout(x, y) {
  return x >= 10.5 && x <= 490.5 && y >= 10.5 && y <= 490.5;
}


function calculateFrame(step, distance, point) {
  let frame = this.canvas.speed * 60;
  point = point || distance / (step * this.canvas.zoom);
  return Math.ceil(point / frame);
}
