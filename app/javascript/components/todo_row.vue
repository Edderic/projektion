<template>
    <tr :class='rowClass' @click='onClick' v-if='editable'>
      <td><div class="todoId"><input type="textarea" :value="todoId" @change='setTodoId'></div></td>
      <td><div class="title"><input type="textarea" @click.stop :value="title" @change='setTitle'></div></td>
      <td>
        <select :value='status' class="status-select" @change='setStatus'>
          <option>Not started</option>
          <option>In progress</option>
          <option>Done</option>
        </select>
      </td>
    </tr>
    <tr :class='rowClass' @click='onClick' v-else>
      <td><div class="todoId">{{ todoId }}</div></td>
      <td><div>{{ title }}</div></td>
      <td>
        <select :value='status' class="status-select" @change='setStatus'>
          <option>Not started</option>
          <option>In progress</option>
          <option>Done</option>
        </select>
      </td>
    </tr>
</template>

<script>
  export default {
    computed: {
      rowClass() {
        if (this.active) {
          return ['active'];
        }

        return ['inactive'];
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
              canEdit: !this.canEdit
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
  .todoId, .title {
    width: 100px;
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
</style>
