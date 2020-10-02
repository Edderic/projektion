<template>
  <div id='app'>
    <table>
      <thead>
        <tr>
          <th colspan=8></th>
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
        <tr
          v-for='label in labels'
        >
          <td>{{label.name}}</td>
          <td colspan=6>{{`${label.deadline.getMonth()}/${label.deadline.getDate()}`}}</td>
          <td>{{label.onTrack}}</td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th>Name</th>
          <th>M</th>
          <th>T</th>
          <th>W</th>
          <th>T</th>
          <th>F</th>
          <th>Apply</th>
          <th>Labels</th>
        </tr>
      </thead>
      <tbody>
        <AvailabilityRow v-for='person in people' :person='person'/>
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
  import { mapState } from 'vuex';

  export default {
    components: { AvailabilityRow, Graph, TodoRow },
    created: function created() {
      const node1Id = this.$store.getters.uuidv4();
      const node2Id = this.$store.getters.uuidv4();
      const node3Id = this.$store.getters.uuidv4();
      const reportingId1 = this.$store.getters.uuidv4();
      const reportingId2 = this.$store.getters.uuidv4();
      const peopleId1 = this.$store.getters.uuidv4();
      const peopleId2 = this.$store.getters.uuidv4();

      this.$store.commit('initialState', {
        numberOfDaysToPotentiallyShow: 50,
        todos: [
          {
            x: 400,
            y: 200,
            active: true,
            id: node1Id,
            parentIds: [],
            todoId: 'AB-123',
            title: 'Create the route and controller',
            status: 'Done',
            canEdit: false,
            estimates: [49, 48, 47, 46, 45, 44, 43,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25, 25]
          },
          {
            x: 200,
            y: 300,
            active: false,
            id: node2Id,
            parentIds: [node1Id],
            todoId: 'AB-124',
            title: 'Show a roster',
            status: 'In progress',
            canEdit: false,
            estimates: [25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25, 25]
          },
          {
            x: 400,
            y: 500,
            active: false,
            id: node3Id,
            parentIds: [node2Id],
            todoId: 'BC-100',
            title: 'Add sorting',
            status: 'Not started',
            canEdit: false,
            estimates: [25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25,25, 25, 25, 25, 25, 25, 25, 25]
          }
        ],
        labels: [
          {
            name: 'Reporting',
            id: reportingId1,
            deadline: new Date('2020-10-21'),
            onTrack: "20%",
            peopleIds: [
              peopleId1
            ]
          },
          {
            name: 'Question Bank',
            id: reportingId2,
            deadline: new Date('2020-11-10'),
            onTrack: "30%",
            peopleIds: [
              peopleId2
            ]
          }
        ],
        people: [
          {
            id: peopleId1,
            name: 'Edderic',
            labels: [
              {
                id: reportingId1,
                name: 'Reporting'
              }
            ],
            availabilityTemplate: {
              'Mon': 5,
              'Tue': 2,
              'Wed': 3,
              'Thu': 3,
              'Fri': 5,
            },
            derivedAvailability: {
              "Fri Oct 02 2020": 7
            }
          },
          {
            id: peopleId2,
            name: 'Frederic',
            availabilityTemplate: {
              'Mon': 1,
              'Tue': 8,
              'Wed': 8,
              'Thu': 3,
              'Fri': 4,
            },
            labels: [
            ],
            derivedAvailability: {
              "Fri Oct 02 2020": 4
            }
          }
        ]
      });
    },
    computed: {
      ...mapState(['todos', 'arrows', 'tabIndex', 'labels', 'people', 'numberOfDaysToPotentiallyShow']),
      dateStrings() {
        let date = new Date();
        let list = [];

        for (let i=0; i<this.numberOfDaysToPotentiallyShow; i++) {

          let _dateString = date.toDateString();

          if (_dateString.split(' ')[0] != 'Sat' && _dateString.split(' ')[0] != 'Sun') {
            list.push(_dateString);
          }

          date.setDate(date.getDate() + 1);
        }

        return list;
      }
    },
    methods: {
    },
    data: function () {
      return {
        components: []
      }
    }
  }
</script>

<style scoped>
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
