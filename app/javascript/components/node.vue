<template>
  <g
    :tabIndex='tabIndex'
  >
    <text :x="x" :y="middleTextY" font-size="10" text-anchor="middle" fill="black">
      {{middleText}}
    </text>
    <text :x="x" :y="bottomTextY" font-size="10" text-anchor="middle" fill="black">
      {{bottomText}}
    </text>
    <circle :cx="x" :cy="y" r="20" fill="white" class="node"
      v-on:click.stop='onClick'
      @mousedown='startDrag'
      :stroke='circleStrokeColor'
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
          return 6;
        }

        return 3;
      },
      middleTextY() {
        return this.y + 4;
      },
      bottomTextY() {
        return this.y + 30;
      },
      tabIndex() {
        if (this.active) {
          return 0;
        } else {
          return -1;
        }
      },
      circleStrokeColor() {
        const mapping = {
          'Not started': 'black',
          'In progress': 'orange',
          'Done': 'green',
        };

        return mapping[this.status];
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
          'toggleArrow',
          {
            id: this.id
          }
        );

        this.$store.commit(
          'setAllNodesInactiveExcept',
          {
            exceptId: this.id
          }
        );

        this.$store.commit(
          'setTabIndex',
          {
            index: 0
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
       'status',
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
</style>
