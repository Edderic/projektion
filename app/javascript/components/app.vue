<template>
  <div id='app' v-on:click='onClick'>
    <component
      v-for="(node, index) in nodes"
      :key="index"
      :is="node.component"
      :x="node.x"
      :y="node.y"
    />
  </div>
</template>

<script>
  import Node from '../components/node';
  import { mapState } from 'vuex';

  export default {
    components: { Node },
    created: function created() {
      this.$store.commit('initialState', {
        nodes: []
      });
    },
    computed: {
      ...mapState(['nodes'])
    },
    methods: {
      onClick(event) {
        this.$store.commit(
          'addNode',
          {
            component: Node,
            x: event.clientX,
            y: event.clientY
          }
        );
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
