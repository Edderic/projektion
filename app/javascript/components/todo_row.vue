<template>
    <tr :class='rowClass'>
      <td>{{ todoId }}</td>
      <td>{{ title }}</td>
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
      }
    },
    methods: {
      setStatus(e) {
        this.$store.commit(
          'setStatusForTodo',
          {
            id: this.id,
            status: e.target.value
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
      }
    }
}
</script>

<style scoped>
  .inactive {
    background-color: #eab5b5;
  }
  .active {
    background-color: white;
  }
</style>
