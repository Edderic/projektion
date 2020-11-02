<template>
  <RouterView class="data-box" />
</template>

<script>

export default {
  created() {
    if (this.$route.name == 'savedProject') {
      this.$store.commit(
        'initialState',
        {
          projectData: window.gon.project_data,
          projectUuid: window.gon.project_uuid
        }
      );
    } else if (this.$route.name == 'projectsList') {
      this.$store.commit(
        'initializeProjects',
        {
          projects: window.gon.projects
        }
      )
    } else {
      this.$store.commit(
        'initialState',
          {
            projectData: {
              labels: [{
                name: 'All',
                id: this.$store.getters.uuidv4(),
                deadline: new Date().toDateString(),
                onTrack: 0,
                peopleIds: [],
                listCompletion: []
              }]
            }
          },
      );
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
