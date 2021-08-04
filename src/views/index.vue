<template>
  <div main>
    <div canvas>
      <button menus @click="showMenus">
        <font-awesome-icon icon="bars" />
      </button>
      <canvas></canvas>
    </div>
    <div panel>
      <div mask v-if="menusShow" @click.stop.prevent.self="hideMenus"></div>
      <div control :class="[menusShow ? 'show' : 'hide']">
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
          <fieldset>
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
            />deg -
            <input
              type="number"
              polarright
              class="input-text range-text"
              @change="setPolarRange"
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
import { CoordinateCanvas } from "./canvas/coordinateCanvas";
import { Pen } from "./canvas/pen";
import { PonitPloter } from "./pointPloter";

export default {
  data: () => ({
    menusShow: false,
    pointPloter: null,
    coordinateCanvas: null,
    expType: "cartesian",
    polarEquation: "1+x",
    cartesianEquation: "1+x",
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
    hideMenus() {
      this.menusShow = false;
    },
    showMenus() {
      this.menusShow = true;
    },
    init() {
      this.coordinateCanvas = new CoordinateCanvas({
        canvas: document.querySelector("div[canvas] canvas"),
        pen: new Pen(
          document.querySelector("div[canvas] canvas").getContext("2d")
        ),
        width: window.innerWidth,
        height: window.innerHeight
      });
      this.coordinateCanvas.enableScale(this.redraw.bind(this));
      this.coordinateCanvas.enableDrag(this.redraw.bind(this));
      this.pointPloter = new PonitPloter({
        canvas: this.coordinateCanvas
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
      this.coordinateCanvas.refresh();
      this.pointPloter.refresh();
      this.drawFunctonImage();
    },
    normalDraw(expType) {
      this.expType = expType || this.expType;
      this.drawFunctonImage();
    },
    repaintScale(scale) {
      this.coordinateCanvas.setZoom(scale);
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
  div[canvas] {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: white;
    [menus] {
      position: absolute;
      right: 2rem;
      padding: 0.5rem 1.5rem;
      border: none;
      background-color: #5f9ea04d;
      top: 20px;
      color: #13121573;
      transition: all 0.3s;
      &:hover {
        background-color: #5f9ea0;
        color: #131215;
      }
    }
  }
  div[panel] {
    [mask] {
      position: fixed;
      width: 100vw;
      top: 0;
      left: 0;
      height: 100vh;
      background-color: #9e9e9e2b;
      z-index: 100;
    }
    .show {
      transform: translateX(0);
    }
    .hide {
      transform: translateX(100%);
    }
    div[control] {
      z-index: 200;
      position: absolute;
      top: 0;
      right: 0;
      height: 100vh;
      background-color: wheat;
      display: flex;
      flex-direction: column;
      padding: 0 0.7rem;
      transition: all 0.3s;
      form {
        fieldset {
          margin-top: 0.5rem;
        }
      }
      .lable {
        margin-bottom: 0.6rem;
        margin-top: 1.2rem;
        user-select: none;
        &:first-of-type {
          margin-top: 0;
        }
      }
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
}
</style>
