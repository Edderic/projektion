<template>
  <tr>
    <td>{{person.name}}</td>
    <ColoredCell
      maxVal=8
      :value='person.availabilityTemplate[key]'
      v-for='key in presortedWeekdayKeys'
      :style="{ padding: availabilityPadding + 'px' }"
    >
      <select :value='person.availabilityTemplate[key]' @change='setAvailabilityTemplate($event, key)'>
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
    <td>apply</td>
    <td>
      <span v-for='label in person.labels'>{{label.name}}</span>
    </td>
    <ColoredCell
      maxVal=8
      :value='availability.value'
      class='cell'
      v-for='availability in orderedAvailability'
      :key='person.id + "-" + availability.dateString + "-" + availability.value'
      :style="{ padding: availabilityPadding + 'px' }"
    >
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
      },
      presortedWeekdayKeys() {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      }
    },
    methods: {
      setDerivedAvailability(e, dateString) {
        this.$store.commit('setPersonDerivedAvailability', {
          dateString,
          id: this.person.id,
          value: e.target.value
        });
      },
      setAvailabilityTemplate(e, weekdayKey) {
        this.$store.commit('setPersonAvailabilityTemplate', {
          id: this.person.id,
          weekday: weekdayKey,
          value: e.target.value
        });
      },
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
