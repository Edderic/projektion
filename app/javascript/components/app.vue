<template>
  <div id='app' v-on:click='onClick'>
    <component
      v-for="(node, index) in nodes"
      :key="index"
      :is="node.component"
      :x="node.x"
      :y="node.y"
      :active="node.active"
      :id="node.id"
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
            y: event.clientY,
            active: true,
            id: this.uuidv4()
          }
        );
      },
      uuidv4() {
        // https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
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
