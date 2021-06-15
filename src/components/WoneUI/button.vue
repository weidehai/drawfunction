<template>
  <button @click="emitClick">{{ text }}</button>
</template>

<script>
export default {
  name: "woneButton",
  data: () => ({}),
  props: {
    text: {
      type: String,
      default: "按钮"
    }
  },
  methods:{
    emitClick(){
      this.$emit('click')
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  padding: 0px 1rem;
  margin-left: 9px;
  border-radius: 5px;
  outline: none;
  border: none;
  background-color: #ff5722;
  color: gold;
  &:hover {
    background-color: #e91e63;
    color: white;
  }
}
</style>
