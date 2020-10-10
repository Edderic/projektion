<template>
  <td
    :style="{ backgroundColor: cellColor }"
  >
    {{ value / maxVal }}
  </td>
</template>

<script>
  export default {
    computed: {
      backgroundColor() {
        return this.$store.getters.getNumSimulations();
      },
      ratio() {
        return this.value / this.maxVal;
      },
      cellColor() {
        const green = {
          'red': 54,
          'green': 255,
          'blue': 101
        }

        // if ratio is 1 then 54
        // if ratio is 0 then 255
        let red = 255 - 201 * this.ratio;
        let blue = 255 - 154 * this.ratio;

        let color = `rgb(${red}, 255, ${blue})`
        return color;
      },
    },
    methods: {
    },
    props: [
      'value',
      'maxVal'
    ]
  }
</script>

<style scoped>
  .node {
    min-height: 50px;
    min-width: 50px;
    position: absolute;
    border-radius: 100%;
  }
</style>
