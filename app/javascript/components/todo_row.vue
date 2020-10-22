<template>
    <div :class='rowClass' @click='onClick' :tabIndex='tabIndex' v-if='editable'>
      <div class="table-cell table-id"><input type="textarea" @click.stop :value="todoId" @change='setTodoId' @keyup.delete.stop></div>
      <div class="table-cell table-title"><input type="textarea" @click.stop :value="title" @change='setTitle' @keyup.delete.stop></div>
      <div class='table-cell table-status'>
        <div :class='statusClasses'></div>
        <select :value='status' class="status-select" @change='setStatus'>
          <option>Not started</option>
          <option>In progress</option>
          <option>Done</option>
        </select>
      </div>
      <div class='table-cell'>
        <DraggableBarGraph
          :id='id'
          :values='estimates'
        />
      </div>
    </div>
    <div :class='rowClass' @click='onClick' :tabIndex='tabIndex'
      v-on:keyup.delete='deleteTodo'
     v-else>
      <div class="table-cell table-id pointable">{{ todoId }}</div>
      <div class="table-cell table-title pointable">{{ title }}</div>
      <div class='table-cell table-status'>
        <div :class='statusClasses'></div>
        <select :value='status' class="status-select" @change='setStatus'>
          <option>Not started</option>
          <option>In progress</option>
          <option>Done</option>
        </select>
      </div>
      <div class='table-cell'>
        <DraggableBarGraph
          :id='id'
          :values='estimates'
        />
      </div>
    </div>
</template>

<script>
  import DraggableBarGraph from '../components/draggable_bar_graph';
  export default {
    components: { DraggableBarGraph },
    computed: {
      statusClasses() {
        let classes = ['status-box'];

        if (this.status == 'Done') {
          classes.push('status-green');
        } else if (this.status == 'In progress') {
          classes.push('status-orange');
        } else {
          classes.push('status-black')
        }

        return classes;
      },
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
        // TODO: store the last clicked and now clicked rows so we can compare if we've changed
        // If they are the same, then we can change the edit
        // If they are not the same, set canEdit of the last one to false
        // Otherwise, toggle canEdit
        // set lastClicked to nowClicked

        this.$store.commit(
          'setTabIndex',
          -1
        );

        const lastClickedTodo = this.$store.getters.getLastClickedTodo();

        if (!lastClickedTodo) {
          this.$store.commit(
            'setTodo',
            {
              id: this.id,
              dict: {
                canEdit: false,
                active: true
              }
            }
          )
        }
        else if (this.todo == lastClickedTodo) {
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
        }
        else {
          // both exist but they are different

          this.$store.commit(
            'setTodo',
            {
              id: lastClickedTodo.id,
              dict: {
                canEdit: false,
                active: false
              }
            }
          );

          this.$store.commit(
            'setTodo',
            {
              id: this.id,
              dict: {
                canEdit: false,
                active: true
              }
            }
          );
        }

        this.$store.commit(
          'setAllNodesInactiveExcept',
          {
            exceptId: this.id
          }
        );

        this.$store.commit(
          'setLastClickedTodo',
          {
            lastClickedTodo: this.todo
          }
        );
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
      },
      'estimates': {
        'default': [25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25]
      },
      'todo': {}
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
    display: flex;
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
    border-bottom: 1px solid black;
  }
  .status-box {
    width: 20px;
    height: 20px;
  }
  .status-green {
    background-color: green;
  }

  .status-orange {
    background-color: orange;
  }

  .status-black {
    background-color: black;
  }

  .status-select {
    height: fit-content;
  }

  .pointable {
    cursor: pointer;
  }
</style>
