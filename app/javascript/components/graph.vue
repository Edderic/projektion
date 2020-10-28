<template>
  <div
    class="graph_wrapper"
    :tabIndex='tabIndex'
    v-on:keyup.delete='deleteTodo'
  >
    <svg
      ref="dag"
      id="dag_view"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 950 800"
      v-on:click='onClick'
      @mousemove='move'
      @mouseup='drop'
      width="950"
      height="800"
      @dragover.prevent
      @dragenter.prevent
    >
      <Arrow
        v-for="arrow in arrows"
        :key="arrow.id"
        :parentNode="arrow.parentNode"
        :childNode="arrow.childNode"
      />
      <Node
        v-for="todo in todos"
        :key="todo.id"
        :todoLabelIds="todo.labelIds"
        :x="todo.x"
        :y="todo.y"
        :active="todo.active"
        :id="todo.id"
        :dragOffsetX="todo.dragOffsetX"
        :dragOffsetY="todo.dragOffsetY"
        :middleText="todo.todoId"
        :bottomText="todo.title"
        :status="todo.status"
      />

    </svg>
  </div>
</template>

<script>
  import Node from '../components/node';
  import Arrow from '../components/arrow';

  export default {
    components: { Node, Arrow },
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
      deleteTodo(e) {
        this.$store.commit(
          'deleteTodo',
          {
            id: this.id
          }
        );
      },
      onClick(event) {
        this.$store.commit(
          'addNode',
          {
            x: event.offsetX,
            y: event.offsetY,
            active: false,
            id: this.$store.getters.uuidv4(),
            parentIds: [],
            title: 'edit me',
            status: 'Not started',
            canEdit: false,
            estimates: [49, 48, 47, 46, 45, 44, 43, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0]
          }
        );

        this.$store.commit(
          'setTabIndex',
          {
            index: 0
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
    },
    props: [
      'todos',
      'arrows'
    ]
  }
</script>

<style scoped>
  .graph_wrapper {
    width: 50%
  }
  #dag_view {
    background-color: #eeeeee;
    border: 1px solid black;
  }
</style>
