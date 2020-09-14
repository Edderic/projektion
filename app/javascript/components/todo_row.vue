<template>
    <tr>
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
      }
    }
}
</script>

<style scoped>
</style>
