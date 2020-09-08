<template>
  <div
    :class='[active ? "active" : "inactive", "node"]'
    :style="styleObject"
    v-on:click.stop='onClick'
    v-on:dragstart='onDragStart'
  >
  </div>
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    computed: {
      styleObject() {
        return {
          top: this.y - 35 + 'px',
          left: this.x - 35 + 'px'
        }
      }
    },
    methods: {
      onClick(e) {
        this.$store.commit(
          'setAllNodesInactiveExcept',
          {
            exceptId: this.id
          }
        );
      },
      onDragStart(e) {
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('itemID', this.id);
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
