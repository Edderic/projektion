<template>
    <div :class='rowClass' @click='onClick' :tabIndex='tabIndex' v-if='editable'>
      <div class="table-cell table-id"><input type="textarea" :value="todoId" @change='setTodoId' @keyup.delete.stop></div>
      <div class="table-cell table-title"><input type="textarea" @click.stop :value="title" @change='setTitle' @keyup.delete.stop></div>
      <div class='table-cell table-status'>
        <select :value='status' class="status-select" @change='setStatus'>
          <option>Not started</option>
          <option>In progress</option>
          <option>Done</option>
        </select>
      </div>
      <DraggableBarGraph
      />
    </div>
    <div :class='rowClass' @click='onClick' :tabIndex='tabIndex'
      v-on:keyup.delete='deleteTodo'
     v-else>
      <div class="table-cell table-id">{{ todoId }}</div>
      <div class="table-cell table-title">{{ title }}</div>
      <div class='table-cell table-status'>
        <select :value='status' class="status-select" @change='setStatus'>
          <option>Not started</option>
          <option>In progress</option>
          <option>Done</option>
        </select>
      </div>
      <DraggableBarGraph
      />
    </div>
</template>

<script>
  import DraggableBarGraph from '../components/draggable_bar_graph';
  export default {
    components: { DraggableBarGraph },
    computed: {
      rowClass() {
        if (this.active) {
          return ['row', 'active'];
        }

        return ['row', 'inactive'];
      },
      tabIndex() {
        if (this.active) {
          return 0;
        } else {
          return -1;
        }
      },
      editable() {
        return this.active && this.canEdit;
      },
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
      setStatus(e) {
        this.$store.commit(
          'setTodo',
          {
            id: this.id,
            dict: {
              status: e.target.value
            }
          }
        )
      },
      onClick(e) {
        this.$store.commit(
          'setTabIndex',
          -1
        );

        this.$store.commit(
          'setTodo',
          {
            id: this.id,
            dict: {
              canEdit: !this.canEdit,
              active: true
            }
          }
        )

        this.$store.commit(
          'setAllNodesInactiveExcept',
          {
            exceptId: this.id
          }
        )
      },
      setTitle(e) {
        this.$store.commit(
          'setTodo',
          {
            id: this.id,
            dict: {
              title: e.target.value
            }
          }
        )
      },
      setTodoId(e) {
        this.$store.commit(
          'setTodo',
          {
            id: this.id,
            dict: {
              todoId: e.target.value
            }
          }
        )
      }
    },
    props: {
      'id': {
        'default': 'edit me'
      },
      'todoId': {
        'default': 'edit me'
      },
      'title': {
        'default': 'edit me'
      },
      'status': {
        'default': 'edit me'
      },
      'active': {
        'default': false
      },
      'canEdit': {
        'default': false
      }
    }
}
</script>

<style scoped>
  .prior {

  }
  .table-cell {
    padding: 10px;
  }
  .table-id {
    width: 4em;
  }
  .table-title {
    width: 8em;
  }

  .table-status {
    width: 7em;
  }

  input {
    width: 100px;
  }
  .inactive {
    background-color: #e6e6e6;
  }
  .active {
    background-color: white;
  }
  td {
    padding: 8px;
  }
  .row {
    display: flex;
  }
</style>
