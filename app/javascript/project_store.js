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

            state.arrows.push({
              x1: parent.x,
              y1: parent.y,
              x2: node.x,
              y2: node.y,
            });
          }
        }
      },
      addNode(state, node) {
        state.nodes.push(node);

        this.commit('setAllNodesInactiveExcept', {
          exceptId: node.id
        });
      },
      addArrow(state, { node1, node2 }) {
        state.arrows.push(
          {
            x1: node1.x,
            y1: node1.y,
            x2: node2.x,
            y2: node2.y,
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
      // 2. Might be good to have nodes be a dictionary
      // so we don't have to search
      //  - had issues with doing so; nodes weren't showing up
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
