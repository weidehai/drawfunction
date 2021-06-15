<template>
  <div
    dialog
    :class="['center', 'fixed', 'centerText', scale ? 'scale' : '']"
    v-show="visiable"
  >
    <div title>
      <p>{{ title }}</p>
    </div>
    <div message>
      <p>{{ message }}</p>
    </div>
    <div button>
      <woneButton text="取消" @click="close"></woneButton>
      <woneButton text="确定" @click="close"></woneButton>
    </div>
  </div>
</template>

<script>
export default {
  name: "woneDialog",
  data: () => ({
    scale:true
  }),
  props: {
    message: {
      type: String,
      default: "我是一个对话框"
    },
    title: {
      type: String,
      default: "对话框"
    },
    visiable:Boolean
  },
  updated(){
    setTimeout(()=>{
      this.scale = false
    },0)
  },
  methods: {
    close(){
      this.scale = true
      this.$emit('update:visiable',false)
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin flexDoubleCenter($direction: row) {
  display: flex;
  flex-direction: $direction;
  justify-content: center;
  align-items: center;
}
div[dialog] {
  width: 350px;
  height: 200px;
  background-color: #f7f1f0;
  box-shadow: #898a80 0 0 5px;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  div[title] {
    height: 20%;
    @include flexDoubleCenter;
  }
  div[message] {
    height: 60%;
    @include flexDoubleCenter;
  }
  div[button] {
    height: 20%;
    display: flex;
    justify-content: flex-end;
  }
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: -50% -50%;
}
.fixed {
  position: fixed;
}
.centerText {
  text-align: center;
}
.scale {
  transform: scale(0.1);
}
</style>
