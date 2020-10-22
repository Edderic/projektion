<template>
  <tr>
    <td></td>
    <td colspan=5 class='deadline-cell'>
      <select :value='deadline' @change='setDeadlineForLabel'>
        <option v-for='dateString in dateStrings'>{{dateString}}</option>
      </select>
    </td>
    <ColoredCell
      colspan=2
      class="availability-cell on-track-cell"
      :value='onTrack'
      :maxVal=1
    />
    <td></td>
    <ColoredCell
      v-for='(count, index) in listCompletion'
      :key='id + "-" + index'
      :value='count'
      :maxVal='numSimulations'
      class="availability-cell"
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
  .deadline-cell {
    text-align: center;
  }
  .availability-cell {
    text-align: center;
  }
  .on-track-cell {
    padding: 0;
    font-weight: 700;
  }
</style>
