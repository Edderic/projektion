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

        for (let todo of todos) {
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
      }
    }
  });
}

export default createStore();
