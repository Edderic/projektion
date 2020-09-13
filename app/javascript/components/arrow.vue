<template>
  <g>
  <line :x1="arrowTip1X" :y1="arrowTip1Y" :x2="bodyX2" :y2="bodyY2" stroke="black" stroke-width="3"/>
  <line :x1="arrowTip2X" :y1="arrowTip2Y" :x2="bodyX2" :y2="bodyY2" stroke="black" stroke-width="3"/>
  <line :x1="bodyX1" :y1="bodyY1" :x2="bodyX2" :y2="bodyY2" stroke="black" stroke-width="3"/>
  </g>
</template>

<script>
  export default {
    computed: {
      bodyX1() {
        return this.parentNode.x + (-20 * Math.cos((this.offsetAngle + this.angle) * Math.PI / 180.0));
      },
      bodyY1() {
        return this.parentNode.y + (-20 * Math.sin((this.offsetAngle + this.angle) * Math.PI / 180.0));
      },
      bodyX2() {
        return this.childNode.x + (21 * Math.cos((this.offsetAngle + this.angle) * Math.PI / 180.0));
      },
      bodyY2() {
        return this.childNode.y + (21 * Math.sin((this.offsetAngle + this.angle) * Math.PI / 180.0));
      },
      angle() {
        return Math.tanh((this.childNode.y - this.parentNode.y) / (this.childNode.x - this.parentNode.x)) *  180 / Math.PI
      },
      offsetAngle() {
        if (this.parentNode.x > this.childNode.x)
          return 0;

        return 180;
      },
      arrowTip1X() {
        return this.bodyX2 + (10 * Math.cos((30 + this.offsetAngle + this.angle) * Math.PI / 180.0))
      },
      arrowTip1Y() {
        return this.bodyY2 + (10 * Math.sin((30 + this.offsetAngle + this.angle) * Math.PI / 180.0))
      },
      arrowTip2X() {
        return this.bodyX2 + (10 * Math.cos((-30 + this.offsetAngle + this.angle) * Math.PI / 180.0))
      },
      arrowTip2Y() {
        return this.bodyY2 + (10 * Math.sin((-30 + this.offsetAngle + this.angle) * Math.PI / 180.0))
      },
    },
    props: [
      'parentNode',
      'childNode',
    ]
  }
</script>

<style scoped>
</style>
