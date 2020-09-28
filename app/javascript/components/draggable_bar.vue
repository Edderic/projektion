<template>
  <g>
    <rect
      :x="barWidth * n"
      :y=y
      :width="barWidth"
      :height="height"
      stroke="white"
      fill="rgb(50, 158, 168, 0.5)"
    />
    <rect
      :x="barWidth * n"
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
      },

      y() {
        return this.maxHeight - this.bottomOffset - this.value;
      }

    },
    methods: {
      mousedown(e) {
        this.$store.commit('startUpdateEstimate');
        // should update here if applicable
      },
      mousemove(e) {
        if (this.$store.getters.isUpdatingEstimate()) {
          let y;

          if (this.maxHeight - this.bottomOffset > e.offsetY) {
            y = e.offsetY;
          } else {
            y = this.maxHeight - this.bottomOffset - 1;
          }

          this.$store.commit(
            'updateTodoEstimate',
            {
              id: this.id,
              estimateIndex: this.n,
              value: this.maxHeight - this.bottomOffset - y
            }
          );
        }
      },
      mouseup(e) {
        this.$store.commit('finishUpdateEstimate');
      },
    },
    props: {
      'id': {},
      'value': { },
      'barWidth': { },
      'maxHeight': { },
      'n': { },
      'bottomOffset': {
        default: 30
      },
    }
  }
</script>

<style scoped>
</style>
