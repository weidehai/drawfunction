<template>
  <div main>
    <div canvas>
      <div control>
        <p class="lable">比例尺调节: 1:{{ zoom }}</p>
        <slideAdjuster
          :values="[20, 40, 60, 80, 100]"
          @change="repaintScale"
        ></slideAdjuster>
        <p class="lable">动画速度: {{animationSpeed}}秒</p>
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
import { expressionParser } from "function-translate";
import { Pen, CoordinateCanvas } from "./canvas";
import { PonitPloter } from "./pointPloter";

export default {
  data: () => ({
    pointPloter: null,
    coordinateCanvas: null,
    expType: "cartesian",
    zoom: 20,
    polarEquation: "sin(2x)",
    cartesianEquation: "tanx",
    enableAnimation: false,
    animationSpeed:1,
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
        width: 500,
        height: 500
      });
      this.coordinateCanvas.enableScale(this.redraw.bind(this));
      this.pointPloter = new PonitPloter({
        canvas: this.coordinateCanvas,
        animationSpeed:this.animationSpeed
      });
    },
    complie: function() {
      let parsedFunction = expressionParser(this[`${this.expType}Equation`]);
      return `y=${parsedFunction}`;
    },
    drawFunctonImage() {
      let expression = this.complie();
      this.pointPloter.setExp(expression);
      try{
        this.pointPloter[this.expType]();
      }catch(e){
        console.log(e)
        this.tipsComeIn({message:e.message,title:'error!'})
      }
    },
    switchAnimation(state) {
      this.pointPloter.switchAnimation(state)
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
      this.pointPloter.setAnimationSpeed(speed)
      this.animationSpeed = speed
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
