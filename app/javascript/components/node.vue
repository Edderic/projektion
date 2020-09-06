<template>
  <div :class='[active ? "active" : "inactive", "node"]' :style="styleObject" v-on:click.stop='onClick'>
    <p>{{ message }}</p>
  </div>
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    methods: {
      onClick(e) {
        this.active = !this.active;
        // set all other nodes' active to false
      },
    },
    props: ['x', 'y'],
    data: function () {
      return {
        message: "Hello",
        active: false,
        classObject: {
          node: true,
          active: this.active,
        },
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
    border-radius: 100%;
  }
  .active {
    border: 3px solid black;
  }
  .inactive {
    border: 1px solid black;
  }
</style>
