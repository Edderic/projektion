/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      todos: [],
      tabIndex: -1,
      arrows: [],
      draggingNode: null,
      draggingNodeStartX: null,
      draggingNodeStartY: null,
      draggingNodeDropX: null,
      draggingNodeDropY: null,
      updatingEstimate: false
    },
    getters: {
      getRootNodes: (state) => () => {
        let rootNodes = [];

        for (let todo of state.todos) {
          if (todo.parentIds.length == 0) {
            rootNodes.push(todo);
          }
        }

        return rootNodes;
      },
      getTodoById: (state) => (id) => {
        return state.todos.find(todo => todo.id === id);
      },
      getArrowByNodeIds: (state) => (parentNodeId, childNodeId) => {
        return state.arrows.find(
          arrow => arrow.parentNode.id === parentNodeId && arrow.childNode.id === childNodeId
        );
      },
      getActiveNode: (state) => () => {
        return state.todos.find(todo => todo.active);
      },
      isUpdatingEstimate: (state) => () => {
        return state.updatingEstimate;
      },
      uuidv4: () => () => {
        // https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
    },
    mutations: {
      initialState(
        state,
        {
          todos,
          labels,
          people,
          numberOfDaysToPotentiallyShow
        }
      ) {
        state.todos = todos;
        state.labels = labels;
        state.people = people;
        state.numberOfDaysToPotentiallyShow = numberOfDaysToPotentiallyShow;

        this.commit('initializeArrows');
        this.commit('initializeAvailability');
        this.commit('simulate');
      },

      simulate(state) {
        function getDay(date) {
          return date.toDateString().split(' ')[0];
        }

        function updateDateByOneDaySim(date) {
          date.setDate(date.getDate() + 1);
        }

        function skipWeekend(date) {
          while(getDay(date) == 'Sun' || getDay(date) == 'Sat') {
            updateDateByOneDaySim(date);
          }
        }

        function numHoursAvailForPersonSim(person, date) {
          return person.simAvailability[date.toDateString()];
        }

        function isInProgressTodoSim(todo) {
          return todo.simStatus == 'In progress';
        }

        function isNotStartedTodoSim(todo) {
          return todo.simStatus == 'Not started';
        }

        function isDoneTodoSim(todo) {
          return todo.simStatus == 'Done';
        }

        function inProgressTodosSim(todos) {
          return todos.filter((todo) => {
            return isInProgressTodoSim(todo);
          });
        }

        function notStartedTodosSim(todos) {
          return todos.filter((todo) => {
            return isNotStartedTodoSim(todo);
          });
        }

        function doneTodosSim(todos) {
          return todos.filter((todo) => {
            return isDoneTodoSim(todo);
          });
        }

        function finishTodoSim(todo, date, i) {
          if (todo.simStatus == 'In progress' && todo.simDoneAt[i] == date.toDateString()) {
            todo.simStatus = 'Done';
          }
        }

        function consumeAvailability(date, person, numDaysEstimate) {
          let dateCopy = new Date(date.toDateString());
          let numHoursEstimate = numDaysEstimate * 8; // 8 hours per day
          let availForDay = person.simAvailability[dateCopy.toDateString()];

          while (numHoursEstimate > availForDay) {
            person.simAvailability[dateCopy.toDateString()] = 0;
            updateDateByOneDaySim(dateCopy);
            skipWeekend(dateCopy);
            numHoursEstimate -= availForDay;
            availForDay = person.simAvailability[dateCopy.toDateString()];
          }

          person.simAvailability[dateCopy.toDateString()] -= numHoursEstimate;

          return dateCopy;
        }

        function sampleFromArray(array) {
          return array[Math.floor(Math.random() * array.length)];
        }

        function startWorkOnTodo(todo, date, person) {
          let numDaysEstimate = sampleFromArray(todo.simEstimates);

          let finishDate = consumeAvailability(date, person, numDaysEstimate);
          todo.simDoneAt.push(finishDate.toDateString());
          todo.simStatus = 'In progress';
        }

        function todosAllDoneSim(todos) {
          return doneTodosSim(todos).length == todos.length;
        }

        function startableTodoByPersonSim(person, todo, todoParents, date) {
          return (
            isNotStartedTodoSim(todo) &&
            todosAllDoneSim(todoParents) &&
            numHoursAvailForPersonSim(person, date) > 0
          );
        }

        function findParents(todo, arrows) {
          let parents = [];

          for (let arrow of arrows) {
            if (arrow.childNode == todo) {
              parents.push(arrow.parentNode);
            }
          }

          return parents;
        }

        let people = state.people;

        let numSims = 5;

        for (let i = 0; i < numSims; i++) {
          this.commit('prepareTodosForSim', {i});
          this.commit('copyAvailabilityForSim');

          let date = new Date();
          skipWeekend(date);

          // prepare what's currently in progress'
          for (let finishableTodo of inProgressTodosSim(state.todos)) {
            let person = sampleFromArray(state.people);
            startWorkOnTodo(finishableTodo, date, person);
          }

          while(!todosAllDoneSim(state.todos)) {
            for (let finishableTodo of inProgressTodosSim(state.todos)) {
              // TODO: when a todo is assigned to somoene, only they should be able to start it
              //
              finishTodoSim(finishableTodo, date, i);
            }

            for (let person of people) {
              // state.todos can be modified with visitables
              for (let notStartedTodo of notStartedTodosSim(state.todos)) {
                let todoParents = findParents(notStartedTodo, state.arrows);

                if (startableTodoByPersonSim(person, notStartedTodo, todoParents, date)) {
                  startWorkOnTodo(notStartedTodo, date, person);
                }
              }
            }

            for (let finishableTodo of inProgressTodosSim(state.todos)) {
              // TODO: when a todo is assigned to somoene, only they should be able to start it
              //
              finishTodoSim(finishableTodo, date, i);
            }

            updateDateByOneDaySim(date);
            skipWeekend(date);
          }
        }
      },

      initializeAvailability(state) {
        for (let person of state.people) {
          let availabilityTemplate = person.availabilityTemplate;

          let date = new Date();

          for (let i=0; i<state.numberOfDaysToPotentiallyShow; i++) {
            let dateString = date.toDateString();
            let day = dateString.split(' ')[0];

            if (day != 'Sun' && day != 'Sat' && !person.derivedAvailability[dateString]) {

              // this is buggy. We'll be saving a bunch of availabilities over
              // time, and this list will grow We only want to show the X
              // number of availabilities starting today.
              person.derivedAvailability[dateString] = availabilityTemplate[day];
            }

            date.setDate(date.getDate() + 1);
          }
        }
      },

      initializeArrows(state) {
        for (let todo of state.todos) {
          for (let parentId of todo.parentIds) {
            let parent = this.getters.getTodoById(parentId);

            this.commit(
              'addArrow',
              {
                parentNode: parent,
                childNode: todo,
              }
            );
          }
        }
      },
      addNode(state, node) {
        state.todos.push(node);

        this.commit('setAllNodesInactiveExcept', {
          exceptId: node.id
        });
      },
      addArrow(state, { parentNode, childNode }) {
        state.arrows.push(
          {
            parentNode,
            childNode
          }
        );
      },

      deleteTodo(state) {
        const activeNode = this.getters.getActiveNode();

        if (activeNode) {
          const todoIndex = state.todos.findIndex(
            (todo) => todo.id == activeNode.id
          );

          state.todos.splice(todoIndex, 1);

          // remove associated arrows
          let arrows = [];

          for (let arrow of state.arrows) {
            if (arrow.parentNode !== activeNode && arrow.childNode !== activeNode) {
              arrows.push(arrow);
            }
          }

          state.arrows = arrows;
        }
      },
      startDrag(state,
        {
          id,
          dragOffsetX,
          dragOffsetY
        }
      ) {
        for (let node of state.todos) {
          if (node.id == id) {
            node.dragOffsetX = dragOffsetX;
            node.dragOffsetY = dragOffsetY;
            state.draggingNode = node;
            state.draggingNodeStartX = node.x;
            state.draggingNodeStartY = node.y;
          } else {
            node.dragOffsetX = null;
            node.dragOffsetY = null;
          }
        }
      },
      moveNode(state, { id, offsetX, offsetY }) {
        if (!state.draggingNode) {
          return;
        }

        state.draggingNode.x = offsetX - state.draggingNode.dragOffsetX;
        state.draggingNode.y = offsetY - state.draggingNode.dragOffsetY;
      },

      dropNode(state) {
        if (state.draggingNode) {
          state.draggingNodeDropX = state.draggingNode.x;
          state.draggingNodeDropY = state.draggingNode.y;
        }

        state.draggingNode = null;
      },

      removeArrow(state, { parentNode, childNode }) {
        const arrowIndex = state.arrows.findIndex(
          (arrow) => arrow.parentNode == parentNode && arrow.childNode == childNode
        );

        state.arrows.splice(arrowIndex, 1);
      },

      setAllNodesInactiveExcept(state, { exceptId }) {
        for (let node of state.todos) {
          if (node.id != exceptId) {
            node.active = false;
          }
        }
      },
      setTabIndex(state, { index }) {
        state.tabIndex = index;
      },
      setTodo(state, { id, dict }) {
        let node = this.getters.getTodoById(id);

        for (let key in dict) {
          node[key] = dict[key];
        }
      },
      toggleArrow(state, {id}) {
        const parentNode = this.getters.getActiveNode();
        const childNode = this.getters.getTodoById(id);

        if (!parentNode || !childNode || parentNode === childNode) {
          if (
            state.draggingNodeStartX &&
            state.draggingNodeStartX == state.draggingNodeDropX &&
            state.draggingNodeStartY == state.draggingNodeDropY
          ) {
            this.commit(
              'toggleActive',
              {
                id
              }
            );
          }

          return;
        }

        const arrow = this.getters.getArrowByNodeIds(
          parentNode.id,
          childNode.id
        );

        const backwardArrow = this.getters.getArrowByNodeIds(
          childNode.id,
          parentNode.id
        );

        if (backwardArrow) {
          this.commit(
            'removeArrow',
            {
              parentNode: childNode,
              childNode: parentNode
            }
          );
        } else {

          if (arrow) {
            this.commit(
              'removeArrow',
              {
                parentNode,
                childNode
              }
            );
          }
          else {
            this.commit(
              'addArrow',
              {
                parentNode,
                childNode
              }
            );
          }
        }
      },
      toggleActive(state, {id}) {
        let todo = this.getters.getTodoById(id);
        todo.active = !todo.active;
      },
      startUpdateEstimate(state) {
        state.updatingEstimate = true;
      },
      finishUpdateEstimate(state) {
        state.updatingEstimate = false;
      },
      updateTodoEstimate(state, {id, estimateIndex, value}) {
        let todo = this.getters.getTodoById(id);

        Vue.set(todo.estimates, estimateIndex, value);
      },

      prepareTodosForSim(state, {i}) {
        for (let node of state.todos) {
          if (i == 0) {
            node.simDoneAt = [];
          }

          node.simStatus = node.status;

          // create the simulationEstimates
          node.simEstimates = [];

          for (let j = 0; j < node.estimates.length; j++) {
            let numberOfDays = j / 4;
            let height = node.estimates[j];

            for (let h = 0; h < height; h++) {
              node.simEstimates.push(numberOfDays);
            }
          }
        }
      },

      copyAvailabilityForSim(state) {
        for (let person of state.people) {
          person.simAvailability = JSON.parse(
            JSON.stringify(person.derivedAvailability)
          );
        }
      }
    }
  });
}

export default createStore();
