<template>
  <div id='app' v-on:click='onClick'>
    <p>HELLO</p>
    <component
      v-for="(component_hash, index) in components"
      :key="index"
      :is="component_hash.component"
      :x="component_hash.x"
      :y="component_hash.y"
    />
  </div>
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    methods: {
      onClick(event) {
        this.components.push({
          component: Node,
          x: event.clientX,
          y: event.clientY
        });
      }
    },
    data: function () {
      return {
        components: []
      }
    }
  }
</script>

<style scoped>
  #app {
    height: 800px;
    width: 800px;
    background-color: red;
    position: relative;
  }
  p {
    font-size: 2em;
    text-align: center;
  }
</style>
