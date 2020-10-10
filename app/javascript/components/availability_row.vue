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
    <td
      v-for='(availability, dateString) in derivedAvailability'
      :style="{ padding: availabilityPadding + 'px' }"
    >
      <select :value='availability' @change='setDerivedAvailability($event, dateString)'>
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
    </td>
  </tr>
</template>

<script>
  export default {
    computed: {
    },
    methods: {
      setDerivedAvailability(e, dateString) {
        this.$store.commit('setPersonDerivedAvailability', {
          dateString,
          id: this.person.id,
          value: e.target.value
        });
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
