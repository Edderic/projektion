<template>
  <tr>
    <td>{{name}}</td>
    <td colspan=6>
      <select value='deadline' @change='setDeadlineForLabel'>
        <option v-for='dateString in dateStrings'>{{dateString}}</option>
      </select>
    </td>
    <ColoredCell
      :value='onTrack'
      :maxVal=1
    />
    <ColoredCell
      v-for='(count, index) in listCompletion'
      :value='count'
      :maxVal='numSimulations'
    />
  </tr>
</template>

<script>
  import ColoredCell from '../components/colored_cell';

  export default {
    components: { ColoredCell },
    computed: {
      numSimulations() {
        return this.$store.getters.getNumSimulations();
      },
    },
    methods: {
      setDeadlineForLabel(e) {
        this.$store.commit('setLabel', {
          id: this.id,
          dict: {
            deadline: e.target.value
          }
        })
      }
    },
    props: [
      'id',
      'name',
      'deadline',
      'listCompletion',
      'onTrack',
      'dateStrings',
    ]
  }
</script>

<style scoped>
</style>
