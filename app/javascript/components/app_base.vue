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
          project_data: window.gon.project_data
        }
      );
    } else {
      this.$store.commit(
        'initialState',
          {
            project_data: {
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
