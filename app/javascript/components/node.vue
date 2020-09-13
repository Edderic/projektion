<template>
  <circle :cx="x" :cy="y" r="20" fill="white" class="node"
    v-on:click.stop='onClick'
    @mousedown='startDrag'
    stroke='black'
    :stroke-width="strokeWidth"
  />
</template>

<script>
  export default {
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
      startDrag({offsetX, offsetY}) {
        this.$store.commit(
          'startDrag',
          {
            id: this.id,
            dragOffsetX: offsetX - this.x,
            dragOffsetY: offsetY - this.y
          }
        )
      },
      onClick(e) {
        this.$store.commit(
          'setAllNodesInactiveExcept',
          {
            exceptId: this.id
          }
        );
      },
    },
    props: ['active', 'id', 'x', 'y', 'dragOffsetX', 'dragOffsetY']
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
