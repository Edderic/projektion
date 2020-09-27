<template>
  <g>
    <rect
      :x="barWidth * (n-1)"
      :y=y
      :width="barWidth"
      :height="height"
      stroke="white"
      fill="blue"
    />
    <rect
      :x="barWidth * (n-1)"
      y=0
      :width="barWidth"
      :height=maxHeight
      fill-opacity=0
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mousemove="mousemove"
    />
  </g>
</template>

<script>
  // A bar graph is a bunch of bars X X X X X
  // When mousedown is done on any of those bars, set draggingBarGraph to true
  // on store. Then, when mouseover on any of the bars, get where the pointer is
  // and set the y value to that e.offsetY
  // When mouse up is done on any of those bars, set draggingBarGraph to false
  export default {
    computed: {
      height() {
        const tmpHeight = this.maxHeight - this.bottomOffset - this.y;
        if (tmpHeight <= 0) {
          return this.maxHeight - this.bottomOffset;
        } else {
          return this.maxHeight - this.bottomOffset - this.y;
        }
      }
    },
    methods: {
      mousedown(e) {
        this.$store.commit('startUpdateEstimate');
        // should update here if applicable
      },
      mousemove(e) {
        if (this.$store.getters.isUpdatingEstimate()) {
          if (this.maxHeight - this.bottomOffset > e.offsetY) {
            this.y = e.offsetY;
          } else if (this.maxHeight - this.bottomOffset < e.offsetY) {
            this.y = this.maxHeight - this.bottomOffset - 1;
          }
        }
      },
      mouseup(e) {
        this.$store.commit('finishUpdateEstimate');
      },
    },
    data() {
      return {
        y: 25
      }
    },
    props: {
      'barWidth': { },
      'maxHeight': { },
      'n': { },
      'bottomOffset': {
        default: 30
      }
    }
  }
</script>

<style scoped>
</style>
