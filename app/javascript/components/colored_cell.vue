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
        let colors = [
          { name: 'darkRed',
            r: 174,
            g: 17,
            b: 0
          },
          {
            name: 'red',
            r: 219,
            g: 21,
            b: 0
          },

          {
            name: 'orangeRed',
            r: 240,
            g: 90,
            b: 0
          },
          {
            name: 'yellowOrange',
            r: 254,
            g: 160,
            b: 8
          },
          {
            name: 'yellow',
            r: 255,
            g: 233,
            b: 56
          },
          {
            name: 'green',
            r: 87,
            g: 195,
            b: 40
          },
        ];

        for(let i=1; i<= colors.length; i++) {
          if (this.ratio < i/colors.length && this.ratio >= (i-1) / colors.length) {
            let distanceToPrevColor = this.ratio - (i-1) / colors.length;
            let prevColor = colors[i-1];
            let currColor = colors[i];

            let red = prevColor.r + (currColor.r - prevColor.r) * distanceToPrevColor * colors.length;
            let green = prevColor.g + (currColor.g - prevColor.g) * distanceToPrevColor * colors.length;
            let blue = prevColor.b + (currColor.b - prevColor.b) * distanceToPrevColor * colors.length;

            return `rgb(${red}, ${green}, ${blue})`;
          } else if (this.ratio == 1) {
            let lastColor = colors[colors.length-1] ;
            return `rgb(${lastColor.r}, ${lastColor.g}, ${lastColor.b})`;
          }
        }
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
