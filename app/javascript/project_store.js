/*jshint esversion: 8 */
import Vue from 'vue';
import Vuex from 'vuex';
import helpers from './helpers';
import axios from 'axios';
import router from  './router';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      numSims: 1000,
      simulationStale: true,
      simName: 'edit simulation name',
      numDaysToShow: 50,
      todos: [],
      colorInterpolationScheme: [],
      labels: [],
      people: [],
      tabIndex: -1,
      arrows: [],
      lastClickedTodo: null,
      draggingNode: null,
      draggingNodeStartX: null,
      draggingNodeStartY: null,
      draggingNodeDropX: null,
      draggingNodeDropY: null,
      updatingEstimate: false
    },
    actions: {
      async save({ commit, state }) {
        let projectUuid = state.projectUuid;
        if (!projectUuid) {
          projectUuid = this.getters.uuidv4();
        }

        const token =
          document.querySelector('[name=csrf-token]').content;

        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;

        state.projectUuid = projectUuid;

        axios.post(
          `/${projectUuid}`,
          {
            project_uuid: projectUuid,
            data: state
          }
        ).then(() => {
          console.log(router);
          router.push({
            name: 'savedProject',
            params: {
              project_uuid: projectUuid
            }
          });
        }).
          catch(() => { console.log('failure'); });
      }
    },
    getters: {
      getLastClickedTodo: (state) => () => {
        return state.lastClickedTodo;
      },
      getNumDaysToShow: (state) => () => {
        return state.numDaysToShow;
      },
      getColorInterpolationScheme: (state) => () => {
        return state.colorInterpolationScheme;
      },
      getNumSimulations: (state) => () => {
        return state.numSims;
      },
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
      getLabelById: (state) => (id) => {
        return state.labels.find(label => label.id === id);
      },
      getLabelsForTodo: (state, getters) => (id) => {
        let todo = getters.getTodoById(id);

        if (!todo.labelIds) {
          todo.labelIds = [];
        }

        return state.labels.filter((label) => {
          for (let labelId of todo.labelIds) {
            if (labelId === label.id) {
              return true;
            }
          }

          return false;
        });
      },
      getPersonById: (state) => (id) => {
        return state.people.find(person => person.id === id);
      },
      getDateStrings: (state) => () => {
        let date = new Date();
        let list = [];

        for (let i=0; i<state.numDaysToShow; i++) {
          helpers.skipWeekend(date);

          list.push(date.toDateString());

          helpers.updateDateByOneDaySim(date);
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
      editSimName(state, simName) {
        state.simName = simName;
      },
      initialState(
        state,
        {
          projectData,
          projectUuid
        }
      ) {
        state.projectUuid = projectData.projectUuid;
        state.simName = projectData.simName || 'edit simulation name';
        state.colorInterpolationScheme = projectData.colorInterpolationScheme || [
          { name: 'darkRed',
            r: 174,
            g: 17,
            b: 0
          },
          {
            name: 'red',
            r: 219,
            g: 21,
            b: 0
          },

          {
            name: 'orangeRed',
            r: 240,
            g: 90,
            b: 0
          },
          {
            name: 'yellowOrange',
            r: 254,
            g: 160,
            b: 8
          },
          {
            name: 'yellow',
            r: 255,
            g: 233,
            b: 56
          },
          {
            name: 'green',
            r: 87,
            g: 195,
            b: 40
          },
        ];
        state.todos = projectData.todos || [];
        state.labels = projectData.labels || [];
        state.people = projectData.people || [];
        state.numDaysToShow = projectData.numDaysToShow || state.numDaysToShow;
        state.dateStrings = this.getters.getDateStrings();

        this.commit('initializeArrows');
        this.commit('initializeAvailability');
      },

      setSimulationStale(state, stale) {
        state.simulationStale = stale;
      },

      simulate(state) {
        if (state.todos.length == 0) {
          return;
        }
        let people = state.people;

        for (let label of state.labels) {
          label.completionDistribution = helpers.setupSimCounts(
            state.numDaysToShow
          );
        }

        for (let i = 0; i < state.numSims; i++) {
          this.commit('prepareTodosForSim', {i});
          this.commit('copyAvailabilityForSim');

          let date = helpers.getRoughDate();
          helpers.skipWeekend(date);

          // prepare what's done
          for (let doneTodo of helpers.doneTodosSim(state.todos)) {
            doneTodo.simDoneAt.push(date.toDateString());
          }

          // prepare what's currently in progress'
          for (let inProgressTodo of helpers.inProgressTodosSim(state.todos)) {
            let person = helpers.sampleFromArray(state.people);
            helpers.startWorkOnTodo(inProgressTodo, date, person);
          }

          let count = 0;
          while(!helpers.todosAllDoneSim(state.todos)) {
            if (count == 100000) {
              console.warn('Uh-oh. Might have Reached an infinite loop. Returning out of infinite loop');
              return;
            }

            count++;

            for (let finishableTodo of helpers.inProgressTodosSim(state.todos)) {
              // TODO: when a todo is assigned to someone, only they should be
              // able to start it
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
              // TODO: when a todo is assigned to someone, only they should be
              // able to start it
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

          // TODO: make decisions about which label should be updated
          state.labels[0].completionDistribution[maxDate.toDateString()] += 1;
        }

        Vue.set(
          state.labels[0],
          'listCompletion',
          helpers.cumulativeDistribution(
            state.labels[0].completionDistribution,
            state.numDaysToShow
          )
        );

        Vue.set(
          state.labels[0],
          'onTrack',
          helpers.cumulativeDistributionValueForDate(
            state.labels[0].completionDistribution,
            state.labels[0].deadline,
            state.numSims
          )
        );

        this.commit('setSimulationStale', false);
      },

      initializeAvailability(state) {
        for (let person of state.people) {
          let availabilityTemplate = person.availabilityTemplate;

          let date = new Date();

          for (let i=0; i<state.numDaysToShow; i++) {
            helpers.skipWeekend(date);
            let day = helpers.getDay(date);
            let dateString = date.toDateString();
            if (!person.derivedAvailability[dateString]) {
              Vue.set(
                person.derivedAvailability,
                dateString,
                parseInt(person.derivedAvailability[dateString])
              );
            } else {
              Vue.set(
                person.derivedAvailability,
                dateString,
                parseInt(availabilityTemplate[day])
              );
            }

            helpers.updateDateByOneDaySim(date);
          }
        }
      },

      initializeArrows(state) {
        for (let todo of state.todos) {
          for (let parentId of todo.parentIds) {
            let parent = this.getters.getTodoById(parentId);
            if (!parent) {
              let deleteIndex = todo.parentIds.findIndex((id) => id == parentId);
              todo.parentIds.splice(deleteIndex, 1);
            } else {
              state.arrows.push(
                {
                  parentNode: parent,
                  childNode: todo
                }
              );
            }
          }
        }
      },
      addLabel(state, label) {
        label.completionDistribution = label.completionDistribution ||
          helpers.setupSimCounts(
            state.numDaysToShow
          );

        state.labels.push(label);
      },
      addNewPerson(state, person) {
        state.people.push(person);
      },
      addNode(state, node) {
        state.todos.unshift(node);

        this.commit('setAllNodesInactiveExcept', {
          exceptId: node.id
        });

        this.commit('setSimulationStale', true);
      },
      addArrow(state, { parentNode, childNode }) {
        state.arrows.push(
          {
            parentNode,
            childNode
          }
        );

        childNode.parentIds.push(parentNode.id);
        this.commit('setSimulationStale', true);
      },

      addLabelToTodo(state, { id, labelId }) {
        let todo = this.getters.getTodoById(id);

        todo.labelIds.push(labelId);
      },
      deleteLabelFromTodo(state, { id, labelId }) {
        let todo = this.getters.getTodoById(id);

        const labelIndex = todo.labelIds.findIndex(
          (labelId) => labelId === id
        );

        todo.labelIds.splice(labelIndex, 1);
      },
      deletePerson(state, { id }) {
        const personIndex = state.people.findIndex(
          (person) => person.id == id
        );

        state.people.splice(personIndex, 1);
      },
      deleteLabel(state, {id}) {
        const labelIndex = state.labels.findIndex(
          (label) => label.id == id
        );

        // TODO: remove the label_id for each todo
        state.labels.splice(labelIndex, 1);
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

        this.commit('setSimulationStale', true);
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

        const parentIdIndex = childNode.parentIds.findIndex(
          (parentId) => parentId == parentNode.id
        );

        childNode.parentIds.splice(parentIdIndex, 1);
        this.commit('setSimulationStale', true);
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
      setLabel(state, { id, dict }) {
        let label = this.getters.getLabelById(id);

        for (let key in dict) {
          Vue.set(label, key, dict[key]);

          if (key == 'deadline') {
            Vue.set(
              label,
              'onTrack',
              helpers.cumulativeDistributionValueForDate(
                label.completionDistribution,
                dict[key],
                state.numSims
              )
            );
          }
        }
      },
      setTodo(state, { id, dict }) {
        let node = this.getters.getTodoById(id);

        for (let key in dict) {
          Vue.set(node, key, dict[key]);

          if (key == 'status') {
            this.commit('setSimulationStale', true);
          }
        }

      },
      setPerson(state, { id, dict }) {
        let person = this.getters.getPersonById(id);

        for (let key in dict) {
          person[key] = dict[key];
          Vue.set(person, key, dict[key]);
        }

      },
      setPersonAvailabilityTemplate(state, { id, weekday, value }) {
        let person = this.getters.getPersonById(id);

        Vue.set(person.availabilityTemplate, weekday, parseInt(value));

      },
      setPersonDerivedAvailability(state, { id, dateString, value }) {
        let person = this.getters.getPersonById(id);

        Vue.set(person.derivedAvailability, dateString, parseInt(value));

        this.commit('setSimulationStale', true);
      },
      setPersonDerivedAvailabilityBulk(state, { id, derivedAvailability }) {
        // TODO: for some reason, estimates are changing but are not
        // displaying in the derivedAvailability section
        let person = this.getters.getPersonById(id);

        for (let key in derivedAvailability) {
          Vue.set(person.derivedAvailability, key, parseInt(derivedAvailability[key]));
        }

        this.commit('setSimulationStale', true);
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
        if (state.updatingEstimate) {
          this.commit('setSimulationStale', true);
          state.updatingEstimate = false;
        }
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
      },

      setLastClickedTodo(state, { lastClickedTodo }) {
        state.lastClickedTodo = lastClickedTodo;
      }
    }
  });
}

export default createStore();
