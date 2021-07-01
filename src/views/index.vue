<template>
  <div main>
    <div canvas>
      <canvas></canvas>
    </div>
    <div stdin>
      <form style="margin-right:1rem">
        <fieldset>
          <legend>控制面板</legend>
          <div control>
            <p class="lable">比例尺调节: 1:{{ zoom }}</p>
            <slideAdjuster
              :values="[20, 40, 60, 80, 100]"
              @change="repaintScale"
            ></slideAdjuster>
            <p class="lable">动画速度: {{ animationSpeed }}秒</p>
            <slideAdjuster
              :values="[1, 2, 3, 4, 5]"
              @change="setAnimationSpeed"
            ></slideAdjuster>
            <p class="lable">
              动画: {{ enableAnimation ? "已开启" : "已关闭" }}
            </p>
            <switcher @change="switchAnimation"></switcher>
          </div>
        </fieldset>
      </form>
      <form>
        <fieldset>
          <legend>请输入一个显函数</legend>
          表达式：<input
            class="expression-text input-text"
            type="text"
            placeholder="请输入一个显函数"
            v-model="cartesianEquation"
          />
          区间：<input
            cartesianleft
            type="number"
            class="input-text range-text"
            @change="setCartesianRange"
          />
          -
          <input
            cartesianright
            type="number"
            class="input-text range-text"
            @change="setCartesianRange"
          />
          <input
            class="button"
            type="button"
            value="绘制(擦除)"
            @click="redraw('cartesian')"
          />
          <input
            class="button"
            type="button"
            value="绘制(不擦除)"
            @click="normalDraw('cartesian')"
          />
        </fieldset>
        <fieldset style="margin-top:2rem">
          <legend>请输入一个极坐标方程</legend>
          表达式：<input
            class="expression-text input-text"
            type="text"
            placeholder="请输入一个极坐标方程"
            v-model="polarEquation"
          />
          区间：<input
            type="number"
            polarleft
            class="input-text range-text"
            @change="setPolarRange"
            min="0"
          />deg -
          <input
            type="number"
            polarright
            class="input-text range-text"
            @change="setPolarRange"
            min="0"
          />deg
          <input
            class="button"
            type="button"
            value="绘制(擦除)"
            @click="redraw('polar')"
          />
          <input
            class="button"
            type="button"
            value="绘制(不擦除)"
            @click="normalDraw('polar')"
          />
        </fieldset>
      </form>
    </div>
    <woneDialog
      :visiable.sync="showTips"
      :message="tips.message"
      :title="tips.title"
    ></woneDialog>
  </div>
</template>

<script>
import { expressionParser } from "function-translate";
import { Pen, CoordinateCanvas } from "./canvas";
import { PonitPloter } from "./pointPloter";

export default {
  data: () => ({
    pointPloter: null,
    coordinateCanvas: null,
    expType: "cartesian",
    zoom: 20,
    polarEquation: "1+x",
    cartesianEquation: "tanx",
    enableAnimation: false,
    animationSpeed: 1,
    showTips: false,
    tips: {
      message: undefined,
      title: undefined
    }
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.coordinateCanvas = new CoordinateCanvas({
        row: 76,
        col: 76,
        canvas: document.querySelector("div[canvas] canvas"),
        pen: new Pen(
          document.querySelector("div[canvas] canvas").getContext("2d")
        ),
        width: 800,
        height: 500
      });
      this.coordinateCanvas.enableScale(this.redraw.bind(this));
      this.coordinateCanvas.watchMouse(this.redraw.bind(this));
      this.pointPloter = new PonitPloter({
        canvas: this.coordinateCanvas,
        animationSpeed: this.animationSpeed
      });
    },
    complie: function() {
      let parsedFunction = expressionParser(this[`${this.expType}Equation`]);
      return `y=${parsedFunction}`;
    },
    drawFunctonImage() {
      let expression = this.complie();
      this.pointPloter.setExp(expression);
      try {
        this.pointPloter[this.expType]();
      } catch (e) {
        this.tipsComeIn({ message: e.message, title: "error!" });
      }
    },
    switchAnimation(state) {
      this.pointPloter.switchAnimation(state);
      this.enableAnimation = state;
    },
    redraw(expType) {
      this.expType = expType || this.expType;
      this.pointPloter.ensureStopAllPlot(() => {
        this.coordinateCanvas.refresh();
        this.pointPloter.refresh();
        this.drawFunctonImage();
      });
    },
    normalDraw(expType) {
      this.expType = expType || this.expType;
      this.drawFunctonImage();
    },
    repaintScale(scale) {
      this.pointPloter.setZoom(scale);
      this.zoom = scale;
      this.redraw();
    },
    setAnimationSpeed(speed) {
      this.pointPloter.setAnimationSpeed(speed);
      this.animationSpeed = speed;
    },
    tipsComeIn(tips) {
      this.showTips = true;
      if (tips) this.tips = tips;
    },
    setCartesianRange() {
      let left = document.querySelector("input[cartesianleft]");
      let right = document.querySelector("input[cartesianright]");
      if (!left.value || !right.value) return;
      this.pointPloter.setCartesianRange([left.value, right.value]);
    },
    setPolarRange() {
      let left = document.querySelector("input[polarleft]");
      let right = document.querySelector("input[polarright]");
      if (!left.value || !right.value) return;
      this.pointPloter.setPolarRange([left.value, right.value]);
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
  div[top] {
    display: flex;
  }
  div[control] {
    margin-right: 2rem;
    .lable {
      margin-bottom: 0.6rem;
      margin-top: 1.2rem;
      user-select: none;
      &:first-of-type {
        margin-top: 0;
      }
    }
  }
  div[canvas] {
    width: 800px;
    height: 500px;
    position: relative;
    background-color: white;
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: #909090;
    }
    &::-webkit-scrollbar-track {
      border-radius: 20px;
    }
    &::-webkit-scrollbar {
      height: 8px;
      width: 8px;
      background-color: #9e9e9ea6;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #555252;
    }
    &::-webkit-scrollbar-corner {
      background-color: #9e9e9ea6;
      border-end-end-radius: 50%;
    }
  }
  div[stdin] {
    display: flex;
    margin-top: 2rem;
    .tip {
      margin: 10px 0;
    }
    .input-text {
      border-radius: 2px;
      padding: 5px;
      border: 1px solid silver;
    }
    .expression-text {
      width: 200px;
    }
    .range-text {
      width: 4rem;
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
