<template>
  <RouterView class="data-box" />
</template>

<script>
import App from './app';

export default {
  components: { App },
  created() {
    if (this.$route.name == 'savedProject') {
      this.$store.commit(
        'initialState',
        {
          projectData: window.gon.project_data,
          projectUuid: window.gon.project_uuid
        }
      );
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
