<template>
  <div id='project'>
    <table>
      <thead>
        <tr>
          <th>
            <button @click='save'>Save</button>
          </th>
          <th colspan=7></th>
          <th
            v-for='dateString in dateStrings'
          >
            {{ dateString.split(' ')[1][0] }}
          </th>
        </tr>

        <tr>
          <th colspan=8></th>
          <th
            v-for='dateString in dateStrings'
          >
            {{ dateString.split(' ')[2] }}
          </th>
        </tr>

        <tr>
          <th>Label</th>
          <th colspan=6>Deadline</th>
          <th>On Track</th>
          <th
            v-for='dateString in dateStrings'
          >
            {{ dateString.split(' ')[0][0] + dateString.split(' ')[0][1]}}
          </th>
        </tr>
      </thead>
      <tbody>
        <LabelRow
          v-for='label in labels'
          :key='label.id'
          :id='label.id'
          :name='label.name'
          :on-track='label.onTrack'
          :list-completion='label.listCompletion'
          :deadline='label.deadline'
          :dateStrings='dateStrings'
        />
      </tbody>
      <thead>
        <tr>
          <th>
            <button class='add-person-button' @click='createPerson'>+ Person</button>
          </th>
          <th>M</th>
          <th>T</th>
          <th>W</th>
          <th>T</th>
          <th>F</th>
          <th></th>
          <th>Labels</th>
        </tr>
      </thead>
      <tbody>
        <AvailabilityRow
          v-for='person in people'
          :person='person'
          :key='person.id'
          :availabilityPadding='8'
          :derivedAvailability='person.derivedAvailability'
        />
      </tbody>
    </table>



    <div
      id='details'
    >
      <Graph :todos='todos' :arrows='arrows' />

      <div class="todo-rows">
        <div class='table-heading'>
            <div class='header-cell header-id'>ID</div>
            <div class='header-cell header-title'>Title</div>
            <div class='header-cell header-status'>Status</div>
            <div class='header-cell header-estimate'>Estimate</div>
        </div>
        <TodoRow
          v-for='todo in todos'
          :key='todo.id'
          :id='todo.id'
          :todoId='todo.todoId'
          :todo='todo'
          :title='todo.title'
          :status='todo.status'
          :active='todo.active'
          :canEdit='todo.canEdit'
          :estimates='todo.estimates'
        />
      </div>
    </div>
  </div>
</template>

<script>
  import AvailabilityRow from '../components/availability_row';
  import TodoRow from '../components/todo_row';
  import Graph from '../components/graph';
  import LabelRow from '../components/label_row';
  import { mapState } from 'vuex';

  export default {
    components: { AvailabilityRow, Graph, TodoRow, LabelRow },
    created: function created() {
      const reportingId1 = this.$store.getters.uuidv4();
      const reportingId2 = this.$store.getters.uuidv4();
      const peopleId1 = this.$store.getters.uuidv4();
      const peopleId2 = this.$store.getters.uuidv4();

    },
    computed: {
      ...mapState([
          'todos',
          'arrows',
          'tabIndex',
          'labels',
          'people',
          'numberOfDaysToPotentiallyShow',
          'dateStrings',
      ])
    },
    methods: {
      createPerson() {
        const person = {
          id: this.$store.getters.uuidv4(),
          name: 'click to edit me',
          availabilityTemplate: {
            'Mon': 8,
            'Tue': 8,
            'Wed': 8,
            'Thu': 8,
            'Fri': 8,
          },
          derivedAvailability: {},
          labels: []
        }
        this.$store.commit('addNewPerson', person);
      },
      save() {
        this.$store.dispatch('save');
      }
    },
    data: function () {
      return {
        components: []
      }
    }
  }
</script>

<style scoped>
  .add-person-button {
    width: 72px;
  }
  td, th {
    padding: 8px;
  }
  .labels {
    display: flex;
    flex-direction: column;
  }

  #details {
    background-color: white;
    display: flex;
  }
  p {
    font-size: 2em;
    text-align: center;
  }

  .day-cell {
    padding: 10px;
    width: 20px;
    border-bottom: 1px solid black;
  }

  .header-cell {
    padding: 10px;
    border-bottom: 1px solid black;
  }

  .table-heading {
    display: flex;
  }

  .header-id {
    width: 4em;
  }

  .header-title {
    width: 8em;
  }

  .header-status {
    width: 7em;
  }

  .header-estimate {
    width: 300px;
  }

  .todo-rows {
    border: 1px solid black;
    width: 50%
  }
</style>
