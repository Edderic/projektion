<template>
  <div class='node' :style="styleObject" v-on:click.stop='onClick'>
    <p>{{ message }}</p>
  </div>
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    methods: {
      onClick(e) {
        this.active = true;
      },
    },
    props: ['x', 'y'],
    data: function () {
      return {
        message: "Hello",
        active: false,
        styleObject: {
          top: this.y - 35 + 'px',
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
