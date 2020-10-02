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
      v-for='availability in person.derivedAvailability'
      :style="{ padding: availabilityPadding + 'px' }"
    >
      {{availability}}
    </td>
  </tr>
</template>

<script>
  export default {
    computed: {
    },
    methods: {
    },
    props: {
      'person': { },
      'availabilityPadding': {}
    }
}
</script>

<style scoped>
</style>
