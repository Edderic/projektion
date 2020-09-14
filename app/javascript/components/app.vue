<template>
  <div
    id='app'
  >
    <svg
      ref="dag"
      id="dag_view"
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
        v-for="todo in todos"
        :key="todo.id"
        :x="todo.x"
        :y="todo.y"
        :active="todo.active"
        :id="todo.id"
        :dragOffsetX="todo.dragOffsetX"
        :dragOffsetY="todo.dragOffsetY"
        :middleText="todo.todoId"
        :bottomText="todo.title"
      />

      <Arrow
        v-for="arrow in arrows"
        :key="arrow.id"
        :parentNode="arrow.parentNode"
        :childNode="arrow.childNode"
      />
    </svg>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Assignee(s)</th>
          <th>Estimate</th>
          <th>Labels</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <TodoRow
          v-for='todo in todos'
          :id='todo.id'
          :todoId='todo.todoId'
          :title='todo.title'
          :status='todo.status'
          :active='todo.active'
        />
      </tbody>
    </table>

  </div>
</template>

<script>
  import Node from '../components/node';
  import Arrow from '../components/arrow';
  import TodoRow from '../components/todo_row';
  import { mapState } from 'vuex';

  export default {
    components: { Node, Arrow, TodoRow },
    created: function created() {
      const node1Id = this.uuidv4();
      const node2Id = this.uuidv4();
      const node3Id = this.uuidv4();

      this.$store.commit('initialState', {
        todos: [
          {
            x: 400,
            y: 200,
            active: true,
            id: node1Id,
            parentIds: [],
            todoId: 'AB-123',
            title: 'Create the route and controller',
            status: 'Done'
          },
          {
            x: 200,
            y: 300,
            active: false,
            id: node2Id,
            parentIds: [node1Id],
            todoId: 'AB-124',
            title: 'Show a roster',
            status: 'In progress'
          },
          {
            x: 400,
            y: 500,
            active: false,
            id: node3Id,
            parentIds: [node2Id],
            todoId: 'BC-100',
            title: 'Add sorting',
            status: 'Not started'
          }
        ]
      });
    },
    computed: {
      ...mapState(['todos', 'arrows'])
    },
    methods: {
      onClick(event) {
        this.$store.commit(
          'addNode',
          {
            x: event.offsetX,
            y: event.offsetY,
            active: true,
            id: this.uuidv4(),
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
    display: flex;
  }
  #dag_view {
    background-color: white;
    border: 1px solid black;
  }
  p {
    font-size: 2em;
    text-align: center;
  }
</style>
