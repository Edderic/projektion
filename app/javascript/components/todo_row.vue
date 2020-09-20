<template>
    <div :class='rowClass' @click='onClick' v-if='editable'>
      <div class="table-id"><input type="textarea" :value="todoId" @change='setTodoId'></div>
      <div class="table-title"><input type="textarea" @click.stop :value="title" @change='setTitle'></div>
      <select :value='status' class="table-status status-select" @change='setStatus'>
        <option>Not started</option>
        <option>In progress</option>
        <option>Done</option>
      </select>
    </div>
    <div :class='rowClass' @click='onClick' v-else>
      <div class="table-id">{{ todoId }}</div>
      <div class="table-title">{{ title }}</div>
      <select :value='status' class="table-status status-select" @change='setStatus'>
        <option>Not started</option>
        <option>In progress</option>
        <option>Done</option>
      </select>
    </div>
</template>

<script>
  export default {
    computed: {
      rowClass() {
        if (this.active) {
          return ['row', 'active'];
        }

        return ['row', 'inactive'];
      },
      editable() {
        return this.active && this.canEdit;
      },
    },
    methods: {
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
        console.log('this.canEdit', this.canEdit)
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
