<template>
  <div
    id='app'
  >
    <Graph :todos='todos' :arrows='arrows' />

    <div class="todo-rows">
      <div class='table-heading'>
          <div class='header-cell header-id'>ID</div>
          <div class='header-cell header-title'>Title</div>
          <div class='header-cell header-status'>Status</div>
          <div class='header-cell header-estimate'>Estimate</div>
      </div>
      <TodoRow
        v-for='todo in todos'
        :key='todo.id'
        :id='todo.id'
        :todoId='todo.todoId'
        :title='todo.title'
        :status='todo.status'
        :active='todo.active'
        :canEdit='todo.canEdit'
        :estimates='todo.estimates'
      />
    </div>
  </div>
</template>

<script>
  import TodoRow from '../components/todo_row';
  import Graph from '../components/graph';
  import { mapState } from 'vuex';

  export default {
    components: { Graph, TodoRow },
    created: function created() {
      const node1Id = this.$store.getters.uuidv4();
      const node2Id = this.$store.getters.uuidv4();
      const node3Id = this.$store.getters.uuidv4();

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
            status: 'Done',
            canEdit: false,
            estimates: [49, 48, 47, 46, 45, 44, 43,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25, 25]
          },
          {
            x: 200,
            y: 300,
            active: false,
            id: node2Id,
            parentIds: [node1Id],
            todoId: 'AB-124',
            title: 'Show a roster',
            status: 'In progress',
            canEdit: false,
            estimates: [25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25, 25]
          },
          {
            x: 400,
            y: 500,
            active: false,
            id: node3Id,
            parentIds: [node2Id],
            todoId: 'BC-100',
            title: 'Add sorting',
            status: 'Not started',
            canEdit: false,
            estimates: [25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25, 25]
          }
        ]
      });
    },
    computed: {
      ...mapState(['todos', 'arrows', 'tabIndex'])
    },
    methods: {
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
    background-color: white;
    display: flex;
  }
  p {
    font-size: 2em;
    text-align: center;
  }

  .header-cell {
    padding: 10px;
    border-bottom: 1px solid black;
  }

  .table-heading {
    display: flex;
  }

  .header-id {
    width: 4em;
  }

  .header-title {
    width: 8em;
  }

  .header-status {
    width: 7em;
  }

  .header-estimate {
    width: 300px;
  }

  .todo-rows {
    border: 1px solid black;
    width: 50%
  }
</style>
