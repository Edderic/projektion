<template>
  <div
    id='app'
  >
    <div
      :tabIndex='tabIndex'
      v-on:keyup.delete='deleteTodo'
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
        <Arrow
          v-for="arrow in arrows"
          :key="arrow.id"
          :parentNode="arrow.parentNode"
          :childNode="arrow.childNode"
        />
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
          :status="todo.status"
        />

      </svg>
    </div>
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
      />
    </div>
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
            status: 'Done',
            canEdit: false
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
            canEdit: false
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
            canEdit: false
          }
        ]
      });
    },
    computed: {
      ...mapState(['todos', 'arrows', 'tabIndex'])
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
            id: this.uuidv4(),
            parentIds: [],
            title: 'edit me',
            status: 'Not started',
            canEdit: false
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
    background-color: white;
    display: flex;
  }
  #dag_view {
    background-color: #eeeeee;
    border: 1px solid black;
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
  }
</style>
