/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';
import helpers from './helpers';

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
      getDateStrings: (state) => () => {
        let date = new Date();
        let list = [];

        for (let i=0; i<state.numDaysToShow; i++) {

          let _dateString = date.toDateString();

          if (_dateString.split(' ')[0] != 'Sat' && _dateString.split(' ')[0] != 'Sun') {
            list.push(_dateString);
          }

          date.setDate(date.getDate() + 1);
        }

        return list;
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
          numDaysToShow
        }
      ) {
        state.todos = todos;
        state.labels = labels;
        state.people = people;
        state.numDaysToShow = numDaysToShow;
        state.dateStrings = this.getters.getDateStrings();

        this.commit('initializeArrows');
        this.commit('initializeAvailability');
        this.commit('simulate');
      },

      simulate(state) {
        let people = state.people;

        state.labelCompletion = helpers.setupSimCounts(
          state.numDaysToShow,
          state.labels.map((label) => label.id)
        );

        let numSims = 100;

        for (let i = 0; i < numSims; i++) {
          this.commit('prepareTodosForSim', {i});
          this.commit('copyAvailabilityForSim');

          let date = new Date();
          helpers.skipWeekend(date);

          // prepare what's done
          for (let doneTodo of helpers.doneTodosSim(state.todos)) {
            let person = helpers.sampleFromArray(state.people);
            helpers.startWorkOnTodo(doneTodo, date, person);
          }

          // prepare what's currently in progress'
          for (let finishableTodo of helpers.inProgressTodosSim(state.todos)) {
            let person = helpers.sampleFromArray(state.people);
            helpers.startWorkOnTodo(finishableTodo, date, person);
          }

          while(!helpers.todosAllDoneSim(state.todos)) {
            for (let finishableTodo of helpers.inProgressTodosSim(state.todos)) {
              // TODO: when a todo is assigned to somoene, only they should be able to start it
              //
              helpers.finishTodoSim(finishableTodo, date, i);
            }

            for (let person of people) {
              // state.todos can be modified with visitables
              for (let notStartedTodo of helpers.notStartedTodosSim(state.todos)) {
                let todoParents = helpers.findParents(notStartedTodo, state.arrows);

                if (helpers.startableTodoByPersonSim(person, notStartedTodo, todoParents, date)) {
                  helpers.startWorkOnTodo(notStartedTodo, date, person);
                }
              }
            }

            for (let finishableTodo of helpers.inProgressTodosSim(state.todos)) {
              // TODO: when a todo is assigned to somoene, only they should be able to start it
              //
              helpers.finishTodoSim(finishableTodo, date, i);
            }

            helpers.updateDateByOneDaySim(date);
            helpers.skipWeekend(date);
          }

          let maxDate = helpers.getRoughDate();
          let newDate;

          for (let todo of state.todos) {
            let newDate = new Date(todo.simDoneAt[i]);
            // TODO: might want to filter by labelId

            if (newDate > maxDate) {
              maxDate = newDate;
            }
          }

          state.labelCompletion[state.labels[0].id][maxDate.toDateString()] += 1;
        }

        console.log(state.labelCompletion)

      },

      initializeAvailability(state) {
        for (let person of state.people) {
          let availabilityTemplate = person.availabilityTemplate;

          let date = new Date();

          for (let i=0; i<state.numDaysToShow; i++) {
            helpers.skipWeekend(date);
            let day = helpers.getDay(date);
            person.derivedAvailability[date.toDateString()] = availabilityTemplate[day];
            helpers.updateDateByOneDaySim(date);
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
