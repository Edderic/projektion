<template>
  <div class='projects'>
    <table>
      <tbody>
        <tr
          v-for='project in projects'
          key='project.uuid'
        >
          <td>{{ project.simName }}</td>
          <td>{{ project.owned }}</td>

            <RouterLink
              :to="{ name: 'savedProject', params: { project_uuid: project.uuid } }"
            >
              Go to Project
            </RouterLink>
          <td>{{ project.owned }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import routes from '../router';

  export default {
    computed: {
      ...mapState([
        'projects'
      ]),
    },
  }
</script>

<style scoped>
</style>
