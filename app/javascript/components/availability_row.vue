<template>
  <tr>
    <td v-if='nameEditable'>
      <input type="text" :value="person.name" @change='editName' @blur='toggleNameEditable'>
    </td>
    <td v-else @click='toggleNameEditable' class='pointable'>{{person.name}}</td>

    <ColoredCell
      maxVal=8
      :value='person.availabilityTemplate[key]'
      v-for='key in presortedWeekdayKeys'
      :key='key'
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
    <td>
      <button @click=overrideTemplate>Override Availability</button>
    </td>
    <td>
      <button @click=deletePerson>Delete Person</button>
    </td>
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
        return helpers.getListOfDateValuePairs(
          this.$store.getters.getNumDaysToShow(),
          this.person.derivedAvailability
        )
      },
      presortedWeekdayKeys() {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      }
    },
    data: function() {
      return {
        nameEditable: false,
      }
    },
    methods: {
      editName(e) {
        this.$store.commit(
          'setPerson',
          {
            id: this.person.id,
            dict: {
              name: e.target.value
            }
          }
        );
      },
      toggleNameEditable() {
        this.nameEditable = !this.nameEditable;
      },
      deletePerson() {
        this.$store.commit(
          'deletePerson',
          {
            id: this.person.id
          }
        );
      },
      overrideTemplate(e) {
        const listOfDateStrings = helpers.getListOfDateStrings(
          this.$store.getters.getNumDaysToShow()
        )

        let newDerivedAvailability = {};

        for (let dateString of listOfDateStrings) {
          let day = dateString.split(' ')[0];
          newDerivedAvailability[dateString] = this.person.availabilityTemplate[day];
        }

        this.$store.commit('setPersonDerivedAvailabilityBulk', {
          id: this.person.id,
          derivedAvailability: newDerivedAvailability
        });
      },
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
  .pointable {
    cursor: pointer;
  }
</style>
