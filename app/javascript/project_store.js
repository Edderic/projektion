/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      nodes: [],
      arrows: [],
      draggingNode: null
    },
    getters: {
      getNodeById: (state) => (id) => {
        return state.nodes.find(node => node.id === id);
      }
    },
    mutations: {
      initialState(
        state,
        {
          nodes,
        }
      ) {
        state.nodes = nodes;

        for (let node of state.nodes) {
          for (let parentId of node.parentIds) {
            let parent = this.getters.getNodeById(parentId);

            this.commit(
              'addArrow',
              {
                parentNode: parent,
                childNode: node,
              }
            );
          }
        }
      },
      addNode(state, node) {
        state.nodes.push(node);

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
        for (let node of state.nodes) {
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
        for (let node of state.nodes) {
          node.active = node.id == exceptId;
        }
      }
    }
  });
}

export default createStore();
