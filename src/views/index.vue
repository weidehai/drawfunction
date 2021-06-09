<template>
  <div main>
    <div canvas><canvas></canvas></div>
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
        <input class="button" type="button" value="redraw" />
        <input class="button" type="button" value="ctdraw" />
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
const MAX_ZOOM = 4;
const MIN_SHRINK = 100;
export default {
  data: () => ({
    canvas: {
      instance: null,
      ctx: null,
      height: 500,
      width: 500,
      col: 50,
      row: 50,
      gap: 10
    },
    polarEquation: "",
    explicitFuction: ""
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
      function isMaxZoom(){
        return self.canvas.col <= MAX_ZOOM
      }
      function isMinShrink(){
        return self.canvas.col >= MIN_SHRINK
      }
      const handler = throttler((...rest) => {
        const [arg] = [...rest];
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
        for (
          let left = Math.ceil(this.canvas.row / 2),
            rigth = Math.ceil(this.canvas.row / 2);
          rigth < this.canvas.row;
          rigth++, left--
        ) {
          let xAxis1 = 0.5 + left * this.canvas.gap;
          let xAxis2 = 0.5 + rigth * this.canvas.gap;
          this.drawline(0, 500, xAxis1, xAxis1, "silver");
          this.drawline(0, 500, xAxis2, xAxis2, "silver");
        }
        this.drawline(0, 500, midlinePos, midlinePos, "blue");
      };
      const drawy = () => {
        const midlineIndex = this.canvas.col / 2;
        const midlinePos = 0.5 + midlineIndex * this.canvas.gap;
        for (
          let left = Math.ceil(this.canvas.col / 2),
            rigth = Math.ceil(this.canvas.col / 2);
          rigth < this.canvas.col;
          rigth++, left--
        ) {
          let yAxis1 = 0.5 + left * this.canvas.gap;
          let yAxis2 = 0.5 + rigth * this.canvas.gap;
          this.drawline(yAxis1, yAxis1, 0, 500, "silver");
          this.drawline(yAxis2, yAxis2, 0, 500, "silver");
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
