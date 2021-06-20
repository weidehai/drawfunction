<template>
  <div main>
    <div canvas>
      <div control>
        <p class="lable">比例尺调节: 1:{{ canvas.zoom }}</p>
        <slideAdjuster
          :values="[20, 40, 60, 80, 100]"
          @change="repaintScale"
        ></slideAdjuster>
        <p class="lable">动画速度: {{ canvas.speed }}秒</p>
        <slideAdjuster
          :values="[1, 2, 3, 4, 5]"
          @change="setAnimationSpeed"
        ></slideAdjuster>
        <p class="lable">动画: {{ enableAnimation ? "已开启" : "已关闭" }}</p>
        <switcher @change="switchAnimation"></switcher>
      </div>
      <canvas></canvas>
    </div>
    <div stdin>
      <div explicitFuction>
        <p class="tip">请输入一个显函数</p>
        <input
          class="expression-text"
          type="text"
          placeholder="请输入一个显函数"
          v-model="cartesianEquation"
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
      </div>
      <div polarEquation>
        <p class="tip">请输入一个极坐标方程</p>
        <input
          class="expression-text"
          type="text"
          placeholder="请输入一个极坐标方程"
          v-model="polarEquation"
        />
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
      </div>
    </div>
    <woneDialog
      :visiable.sync="showTips"
      :message="tips.message"
      :title="tips.title"
    ></woneDialog>
  </div>
</template>

<script>
import {
  doEventIfOwner,
  throttler,
  isFunction,
  reliableFloatAdd
} from "../util/main.js";
import { expressionParser } from "function-translate";
import {pen} from './canvas'
const MAX_ZOOM = 4;
const MIN_SHRINK = 100;
export default {
  data: () => ({
    canvas: {
      col: 50,
      row: 50,
      gap: 10,
      originPointX: 0,
      originPointY: 0,
      zoom: 50,
      stopAction: false,
      speed: 1
    },
    type: "",
    polarEquation: "sin(2x)",
    cartesianEquation: "tanx",
    enableAnimation: false,
    drawFunctonTask: null,
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
      pen.init(document.querySelector("div[canvas] canvas").getContext("2d"))
      pen.setCanvas(document.querySelector("div[canvas] canvas"))
      pen.setCanvasWidth(500)
      pen.setCanvasHeight(500)
      this.drawcoordinate();
      this.enableScale();
      this.drawFuncton();
    },
    complie: function() {
      let parsedFunction = expressionParser(this[`${this.type}Equation`]);
      console.log(parsedFunction)
      return `y=${parsedFunction}`;
    },
    drawFuncton() {
      let expression = this.complie();
      this.setPenStyle({
        lineWidth: 1,
        strokeStyle: "red"
      });
      this.plotPoint.call(null, this[this.type], expression);
    },
    plotPoint(strategy, ...rest) {
      strategy(...rest);
    },
    switchAnimation(state) {
      this.enableAnimation = state;
    },
    redraw(type) {
      this.type = type || this.type;
      this.ensureCancelrequestAnimation(this.drawcoordinate);
    },
    normalDraw(type) {
      this.type = type;
      this.drawFuncton();
    },
    repaintScale(scale) {
      this.canvas.zoom = scale;
      this.redraw();
    },
    setAnimationSpeed(speed) {
      this.canvas.speed = speed;
    },
    tipsComeIn(tips) {
      this.showTips = true;
      if (tips) this.tips = tips;
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
    div[control] {
      position: absolute;
      left: -15rem;
      .lable {
        margin-bottom: 0.6rem;
        margin-top: 1.2rem;
        user-select: none;
        &:first-of-type {
          margin-top: 0;
        }
      }
    }
  }
  div[stdin] {
    width: 500px;
    .tip {
      margin: 10px 0;
    }
    .expression-text {
      border-radius: 2px;
      padding: 5px;
      width: 55%;
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
