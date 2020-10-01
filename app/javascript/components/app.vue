<template>
  <div id='app'>
    <div
      class='labels'
    >
      <div class='header-2-label'>
        <div class='header-cell label-name'>Label</div>
        <div class='header-cell label-deadline'>Deadline</div>
        <div class='header-cell label-on-track'>On Track</div>
        <div class='header-cell'
          v-for='dateString in dateStrings'
        >
          {{ dateString.split(' ')[2] }}
        </div>
      </div>

      <div
        v-for='label in labels'
        class='label'
      >
        <div class='header-cell label-name'>{{label.name}}</div>
        <div class='header-cell label-deadline'>{{`${label.deadline.getMonth()}/${label.deadline.getDate()}`}}</div>
        <div class='header-cell label-on-track'>{{label.onTrack}}</div>
      </div>
    </div>



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
  import TodoRow from '../components/todo_row';
  import Graph from '../components/graph';
  import { mapState } from 'vuex';

  export default {
    components: { Graph, TodoRow },
    created: function created() {
      const node1Id = this.$store.getters.uuidv4();
      const node2Id = this.$store.getters.uuidv4();
      const node3Id = this.$store.getters.uuidv4();
      const reportingId1 = this.$store.getters.uuidv4();
      const reportingId2 = this.$store.getters.uuidv4();
      const peopleId1 = this.$store.getters.uuidv4();
      const peopleId2 = this.$store.getters.uuidv4();

      this.$store.commit('initialState', {
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
            availability_template: {
              mon: 5,
              tue: 2,
              wed: 3,
              thu: 3,
              fri: 5,
            },
            actual_availability_schedule: {
              "2020-10-01": 7
            }
          },
          {
            id: peopleId2,
            name: 'Frederic',
            availability_template: {
              mon: 1,
              tue: 8,
              wed: 8,
              thu: 3,
              fri: 4,
            },
            actual_availability_schedule: {
              "2020-10-01": 7
            }
          }
        ]
      });
    },
    computed: {
      ...mapState(['todos', 'arrows', 'tabIndex', 'labels', 'people']),
      dateStrings() {
        let date = new Date()
        let list = []

        for (let i=0; i<50; i++) {
          date.setDate(date.getDate() + 1);

          let dateString = date.toDateString();

          if (dateString.split(' ')[0] != 'Sat' && dateString.split(' ')[0] != 'Sun') {
            list.push(dateString);
          }
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
  .labels {
    display: flex;
    flex-direction: column;
  }
  .label {
    display: flex;
  }
  .header-2-label {
    display: flex;
  }
  .label-name {
    width: 4em;
  }
  .label-deadline {
    width: 4em;
  }
  .label-on-track {
    width: 4em;
  }

  #details {
    background-color: white;
    display: flex;
  }
  p {
    font-size: 2em;
    text-align: center;
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
