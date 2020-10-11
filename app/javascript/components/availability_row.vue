<template>
  <tr>
    <td>{{person.name}}</td>
    <td v-for='value in person.availabilityTemplate'>
      {{value}}
    </td>
    <td>apply</td>
    <td>
      <span v-for='label in person.labels'>{{label.name}}</span>
    </td>
    <ColoredCell
      maxVal=8
      :value='availability.value'
      class='cell'
      v-for='availability in orderedAvailability'
      :key='person.id + "-" + availability.dateString + "-" + availability'
      :style="{ padding: availabilityPadding + 'px' }"
    >
      {{ availability.value }}
      <select :value='availability.value' @change='setDerivedAvailability($event, availability.dateString)'>
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
      </select>
    </ColoredCell>
  </tr>
</template>

<script>
  import ColoredCell from '../components/colored_cell';
  import helpers from '../helpers';

  export default {
    components: { ColoredCell },
    computed: {
      orderedAvailability() {
        return helpers.loopThroughDates(
          this.$store.getters.getNumDaysToShow(),
          this.derivedAvailability
        )
      }
    },
    methods: {
      setDerivedAvailability(e, dateString) {
        this.$store.commit('setPersonDerivedAvailability', {
          dateString,
          id: this.person.id,
          value: e.target.value
        });

        // this.$vm.forceUpdate();
      }
    },
    props: {
      'person': { },
      'derivedAvailability': { },
      'availabilityPadding': {}
    }
}
</script>

<style scoped>
</style>
