<template>
  <td
    :style="{ backgroundColor: cellColor }"
  >
    <slot>
      {{ value / maxVal }}
    </slot>
  </td>
</template>

<script>
  import helpers from '../helpers';

  export default {
    computed: {
      backgroundColor() {
        return this.$store.getters.getNumSimulations();
      },
      ratio() {
        return this.value / this.maxVal;
      },
      cellColor() {
        let colors = this.$store.getters.getColorInterpolationScheme();
        return helpers.interpolateColor(colors, this.ratio);
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
</style>
