<template>
  <div
    id='app'
  >
    <svg
      ref="dag"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 800"
      v-on:click='onClick'
      @mousemove='move'
      @mouseup='drop'
      width="800"
      height="800"
      @dragover.prevent
      @dragenter.prevent
    >
      <Node
        v-for="node in nodes"
        :key="node.id"
        :x="node.x"
        :y="node.y"
        :active="node.active"
        :id="node.id"
        :dragOffsetX="node.dragOffsetX"
        :dragOffsetY="node.dragOffsetY"
      />

      <Arrow
        v-for="arrow in arrows"
        :key="arrow.id"
        :parentNode="arrow.parentNode"
        :childNode="arrow.childNode"
      />
    </svg>

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 100" width="100px" height="35px">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7"
        refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
      <line x1="0" y1="50" x2="250" y2="50" stroke="#000"
      stroke-width="8" marker-end="url(#arrowhead)" />
    </svg>
  </div>
</template>

<script>
  import Node from '../components/node';
  import Arrow from '../components/arrow';
  import { mapState } from 'vuex';

  export default {
    components: { Node, Arrow },
    created: function created() {
      const node1Id = this.uuidv4();
      const node2Id = this.uuidv4();
      const node3Id = this.uuidv4();

      this.$store.commit('initialState', {
        nodes: [
          {
            x: 400,
            y: 200,
            active: true,
            id: node1Id,
            parentIds: []

          },
          {
            x: 200,
            y: 300,
            active: false,
            id: node2Id,
            parentIds: [node1Id]
          },
          {
            x: 400,
            y: 500,
            active: false,
            id: node3Id,
            parentIds: [node2Id]
          }
        ]
      });
    },
    computed: {
      ...mapState(['nodes', 'arrows'])
    },
    methods: {
      onClick(event) {
        this.$store.commit(
          'addNode',
          {
            x: event.offsetX,
            y: event.offsetY,
            active: true,
            id: this.uuidv4()
          }
        );
      },
      move({offsetX, offsetY}) {
        this.$store.commit(
          'moveNode',
          {
            offsetX,
            offsetY
          }
        );
      },
      drop(event) {
        this.$store.commit('dropNode');
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
    background-color: red;
    position: relative;
  }
  p {
    font-size: 2em;
    text-align: center;
  }
</style>
