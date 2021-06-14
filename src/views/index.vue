<template>
  <div main>
    <div canvas>
      <div control>
        <p class="lable">比例尺调节</p>
        <slideAdjuster></slideAdjuster>
        <p class="lable">开启动画</p>
        <switcher></switcher>
      </div>
      <canvas></canvas>
    </div>
    <div toolbar></div>
    <div stdin>
      <div explicitFuction>
        <p class="tip">请输入一个显函数</p>
        <input
          class="expression-text"
          type="text"
          placeholder="请输入一个显函数"
          v-model="explicitFuction"
        />
        <input
          class="button"
          type="button"
          value="redraw"
          @click="drawFuncton"
        />
        <input class="button" type="button" value="complie" @click="complie" />
      </div>
      <div polarEquation>
        <p class="tip">请输入一个极坐标方程</p>
        <input
          class="expression-text"
          type="text"
          placeholder="请输入一个极坐标方程"
          v-model="polarEquation"
        />
        <input class="button" type="button" value="redraw" />
        <input class="button" type="button" value="ctdraw" />
      </div>
    </div>
  </div>
</template>

<script>
import { doEventIfOwner, throttler } from "../util/main.js";
import slideAdjuster from "../components/slideAdjuster.vue";
import switcher from "../components/switcher.vue"
import expressionParser from "../util/parser/main";
const MAX_ZOOM = 4;
const MIN_SHRINK = 100;
export default {
  components: {
    slideAdjuster,
    switcher
  },
  data: () => ({
    canvas: {
      instance: null,
      ctx: null,
      height: 500,
      width: 500,
      col: 50,
      row: 50,
      gap: 10,
      originPointX: 0,
      originPointY: 0,
      zoom: 50,
      stopAction: false
    },
    polarEquation: "",
    explicitFuction: "tanx"
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.canvas.instance = document.querySelector("div[canvas] canvas");
      this.canvas.ctx = this.canvas.instance.getContext("2d");
      this.canvas.instance.width = this.canvas.width;
      this.canvas.instance.height = this.canvas.height;
      this.drawcoordinate();
      this.enableScale();
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
        this.stopAction = true;
        if (isShrink(arg.event) && !isMinShrink()) {
          self.canvas.col += 2;
          self.canvas.row += 2;
          self.canvas.gap = self.canvas.width / self.canvas.col;
          self.drawcoordinate();
        }
        if (isZoom(arg.event) && !isMaxZoom()) {
          self.canvas.col -= 2;
          self.canvas.row -= 2;
          self.canvas.gap = self.canvas.width / self.canvas.col;
          self.drawcoordinate();
        }
        setTimeout(() => {
          this.stopAction = false;
          this.drawFuncton();
        }, 500);
      }, 20);

      this.canvas.instance.addEventListener("mousewheel", function(e) {
        doEventIfOwner(this, e, handler);
      });
    },
    drawcoordinate: function() {
      this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const drawx = () => {
        const midlineIndex = this.canvas.row / 2;
        const midlinePos = 0.5 + midlineIndex * this.canvas.gap;
        this.canvas.originPointY = midlinePos;
        for (
          let left = Math.ceil(this.canvas.row / 2),
            rigth = Math.ceil(this.canvas.row / 2),
            count = 0;
          rigth < this.canvas.row;
          rigth++, left--, count++
        ) {
          let xAxis1 = 0.5 + left * this.canvas.gap;
          let xAxis2 = 0.5 + rigth * this.canvas.gap;
          this.drawline(0, 500, xAxis1, xAxis1, "silver");
          this.drawline(0, 500, xAxis2, xAxis2, "silver");
          if (count % 5 == 0) {
            this.canvas.ctx.textAlign = "center";
            this.canvas.ctx.fillStyle = "purple";
            this.canvas.ctx.font = "bold 16px serif";
            this.canvas.ctx.fillText(-count / 5, xAxis1, midlinePos);
            this.canvas.ctx.fillText(count / 5, xAxis2, midlinePos);
          }
        }
        this.drawline(0, 500, midlinePos, midlinePos, "blue");
      };
      const drawy = () => {
        const midlineIndex = this.canvas.col / 2;
        const midlinePos = 0.5 + midlineIndex * this.canvas.gap;
        this.canvas.originPointX = midlinePos;
        for (
          let left = Math.ceil(this.canvas.col / 2),
            rigth = Math.ceil(this.canvas.col / 2),
            count = 0;
          rigth < this.canvas.col;
          rigth++, left--, count++
        ) {
          let yAxis1 = 0.5 + left * this.canvas.gap;
          let yAxis2 = 0.5 + rigth * this.canvas.gap;
          this.drawline(yAxis1, yAxis1, 0, 500, "silver");
          this.drawline(yAxis2, yAxis2, 0, 500, "silver");
          if (count % 5 == 0) {
            this.canvas.ctx.textAlign = "center";
            this.canvas.ctx.fillStyle = "purple";
            this.canvas.ctx.font = "bold 16px serif";
            this.canvas.ctx.fillText(count / 5, midlinePos, yAxis1);
            this.canvas.ctx.fillText(-count / 5, midlinePos, yAxis2);
          }
        }
        this.drawline(midlinePos, midlinePos, 0, 500, "blue");
      };
      drawx();
      drawy();
    },
    drawline: function(x1, x2, y1, y2, color) {
      this.canvas.ctx.strokeStyle = color;
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x1, y1);
      this.canvas.ctx.lineTo(x2, y2);
      this.canvas.ctx.stroke();
    },
    complie: function() {
      let parsedFunction = expressionParser(this.explicitFuction);
      return `y=${parsedFunction}`;
    },
    drawFuncton() {
      let expression = this.complie();
      this.setPenStyle({
        lineWidth: 1,
        strokeStyle: "red"
      });
      this.plotPoint(0.01, expression);
      this.plotPoint(-0.01, expression);
    },
    isInlayout(x, y) {
      return x >= 10.5 && x <= 490.5 && y >= 10.5 && y <= 490.5;
    },
    plotPoint(step = 0.01, expression) {
      let x = 0,
        y = 0,
        realx = 0,
        realy = 0,
        _realy = null,
        _realx = null,
        self = this;
      doWork();
      function doWork() {
        eval(expression);
        realx = self.canvas.originPointX + x * self.canvas.zoom;
        realy = self.canvas.originPointX - y * self.canvas.zoom;
        if (self.isInlayout(realx, realy)) {
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
          x += step;
          requestAnimationFrame(() => {
            doWork();
          });
        }
      }
    },
    setPenStyle(styleObj) {
      for (let key of Object.keys(styleObj)) {
        this.canvas.ctx[key] = styleObj[key];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div[main] {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  div[canvas] {
    width: 500px;
    height: 500px;
    position: relative;
    div[control]{
      position: absolute;
      left: -15rem;
      .lable{
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        &:first-of-type{
          margin-top: 0;
        }
      }
    }
  }
  div[toolbar] {
    width: 500px;
    height: 20px;
    position: relative;
    top: -20px;
    background-color: gray;
    opacity: 0.2;
  }
  div[stdin] {
    width: 500px;
    .tip {
      margin: 10px 0;
    }
    .expression-text {
      border-radius: 2px;
      padding: 5px;
      width: 60%;
      border: 1px solid silver;
    }
    .button {
      border-radius: 2px;
      padding: 5px;
      border: 1px solid silver;
      margin-left: 0.5rem;
    }
  }
}
</style>
