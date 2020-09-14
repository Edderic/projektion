/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      todos: [],
      arrows: [],
      draggingNode: null
    },
    getters: {
      getTodoById: (state) => (id) => {
        return state.todos.find(todo => todo.id === id);
      }
    },
    mutations: {
      initialState(
        state,
        {
          todos,
        }
      ) {
        state.todos = todos;

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

      startDrag(state,
        {
          id,
          dragOffsetX,
          dragOffsetY
        }
      ) {
        for (let node of state.todos) {
          if (node.id == id) {
            node.active = true;
            node.dragOffsetX = dragOffsetX;
            node.dragOffsetY = dragOffsetY;
            state.draggingNode = node;
          } else {
            node.active = false;
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
        state.draggingNode = null;
      },

      setAllNodesInactiveExcept(state, { exceptId }) {
        for (let node of state.todos) {
          node.active = node.id == exceptId;
        }
      },
      setStatusForTodo(state, { id, status }) {
        let node = this.getters.getTodoById(id);
        node.status = status;
      },
    }
  });
}

export default createStore();
