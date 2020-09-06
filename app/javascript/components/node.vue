<template>
  <div class='node'>
    <p>{{ message }}</p>
  </div>
</template>

<script>
  import Node from '../components/node';

  export default {
    components: { Node },
    methods: {
      onClick(e) {
      }
    },
    data: function () {
      return {
        message: "Hello"
      }
    }
  }
</script>

<style scoped>
  .node {
    min-height: 50px;
    min-width: 50px;
  }
</style>
