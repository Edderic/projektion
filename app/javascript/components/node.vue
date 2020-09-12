<template>

  <circle :cx="x" :cy="y" r="10" fill="white" class="node"
    v-on:click.stop='onClick'
    @mousedown='drag'
    @mousemove='move'
    @mouseup='drop'
    stroke='black'
    :stroke-width="strokeWidth"
  />
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    computed: {
      strokeWidth() {
        if (this.active) {
          return 5;
        }

        return 1;
      }
    },
    data() {
      return {
        offsetX: null,
        offsetY: null
      }
    },
    methods: {
      drag({offsetX, offsetY}) {
        this.dragOffsetX = offsetX - this.x;
        this.dragOffsetY = offsetY - this.y;
      },
      onClick(e) {
        this.$store.commit(
          'setAllNodesInactiveExcept',
          {
            exceptId: this.id
          }
        );
      },
      move({offsetX, offsetY}) {
        if (this.dragOffsetX == null || this.dragOffsetY == null) {
          return;
        }

        this.$store.commit(
          'dropNode',
          {
            id: this.id,
            x: offsetX - this.dragOffsetX,
            y: offsetY - this.dragOffsetY
          }
        );
      },
      drop(event) {
        this.dragOffsetX = null;
        this.dragOffsetY = null;
      },
    },
    props: ['active', 'id', 'x', 'y']
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
