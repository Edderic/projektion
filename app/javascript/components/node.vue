<template>
  <div class='node' :style="styleObject">
    <p>{{ message }}</p>
  </div>
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    methods: {
      onClick(e) {
      },
    },
    props: ['x', 'y'],
    data: function () {
      return {
        message: "Hello",
        styleObject: {
          top: this.y - 60 + 'px',
          left: this.x - 35 + 'px'
        }
      }
    }
  }
</script>

<style scoped>
  .node {
    min-height: 50px;
    min-width: 50px;
    position: absolute;
    border: 1px solid black;
    border-radius: 100%;
  }
</style>
