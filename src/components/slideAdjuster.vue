<template>
  <div>
    <div slideAdjuster>
      <div class="roundSpot"></div>
      <hr />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.lable {
  margin-bottom: 0.5rem;
}
div[slideAdjuster] {
  width: 10rem;
  padding: 0.9rem;
  position: relative;
  background-color: #87dec8;
  box-shadow: palegreen 0 0 5px;
  border-radius: 1.2rem;
  .roundSpot {
    height: 0.9rem;
    width: 0.9rem;
    border-radius: 50%;
    background-color: #ff9800;
    position: absolute;
    bottom: 0.48rem;
    box-shadow: #ff2f05 0px 0px 8px;
  }
}
</style>
