<template>
  <div id='app' v-on:click='onClick'>
    <p>HELLO</p>
    <component
      v-for="(component, index) in components"
      :key="index"
      :is="component"
    />
  </div>
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    methods: {
      onClick(e) {
        console.log(event.clientX); // x coordinate
        console.log(event.clientY); // y coordinate

        // pageX/Y gives the coordinates relative to the <html> element in CSS pixels.
        console.log(event.pageX);
        console.log(event.pagey);

        // screenX/Y gives the coordinates relative to the screen in device pixels.
        console.log(event.screenX);
        console.log(event.screenY);

        this.components.push(Node);
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
    height: 100%;
    width: 100%;
    position: relative;
  }
  p {
    font-size: 2em;
    text-align: center;
  }
</style>
