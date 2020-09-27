<template>
      <svg
        class='prior'
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="barGraphViewBox"
        :width=barGraphWidth
        :height=barGraphHeight
        @mouseleave="mouseleave"
        @click.stop
      >
        <text
          v-for="tick in vticks"
          :x="tick.x"
          :y="barGraphHeight - 10"
          class='x-label'
        >{{tick.text}}</text>

        <line
          x1="0"
          :y1="barGraphHeight - bottomOffset"
          :x2="barGraphWidth"
          :y2="barGraphHeight - bottomOffset"
          stroke="black"
          strokeWidth="1"
        />

        <DraggableBar
          v-for="n in numberOfBars"
          :key=n
          :barWidth="barWidth"
          :n=n
          :maxHeight="barGraphHeight"
          :bottomOffset="bottomOffset"
        />
      </svg>
</template>

<script>
  import DraggableBar from '../components/draggable_bar';
  // A bar graph is a bunch of bars X X X X X
  // When mousedown is done on any of those bars, set draggingBarGraph to true
  // on store. Then, when mouseover on any of the bars, get where the pointer is
  // and set the y value to that e.offsetY
  // When mouse up is done on any of those bars, set draggingBarGraph to false
  export default {
    components: { DraggableBar },
    computed: {
      barWidth() {
        return this.barGraphWidth / this.numberOfBars;
      },
      barGraphViewBox() {
        return `0 0 ${this.barGraphWidth} ${this.barGraphHeight}`;
      },
      vticks() {
        let collection = [];

        for (let i=0; i <= 7; i+=1) {
          collection.push({
            x: 1 + this.barWidth * i * 4,
            text: i
          });
        }

        return collection;
      }
    },
    methods: {
      mouseleave() {
        this.$store.commit('finishUpdateEstimate');
      }
    },
    props: {
      'bottomOffset': {
        'default': 30
      },
      'numberOfBars': {
        'default': 29
      },
      'barGraphWidth': {
        'default': 300
      },
      'barGraphHeight': {
        'default': 80
      },
    }
  }
</script>

<style scoped>
  .prior {
    background-color: white;
    border: 1px solid black;
  }
</style>
