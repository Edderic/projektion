<template>
  <g>
    <text :x="x" :y="middleTextY" font-size="10" text-anchor="middle" fill="black">
      {{middleText}}
    </text>
    <text :x="x" :y="bottomTextY" font-size="10" text-anchor="middle" fill="black">
      {{bottomText}}
    </text>
    <circle :cx="x" :cy="y" r="20" fill="white" class="node"
      v-on:click.stop='onClick'
      @mousedown='startDrag'
      stroke='black'
      :stroke-width="strokeWidth"
      fill-opacity=0
    />
  </g>
</template>

<script>
  export default {
    computed: {
      strokeWidth() {
        if (this.active) {
          return 5;
        }

        return 1;
      },
      middleTextY() {
        return this.y + 4;
      },
      bottomTextY() {
        return this.y + 30;
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
    props: [
      'active',
       'id',
       'x',
       'y',
       'dragOffsetX',
       'dragOffsetY',
       'parents',
       'middleText',
       'bottomText',
     ]
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
