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
    mutations: {
      initialState(
        state,
        {
          nodes,
          arrows
        }
      ) {
        state.nodes = nodes;
      },
      addNode(state, node) {
        state.nodes.push(node);

        this.commit('setAllNodesInactiveExcept', {
          exceptId: node.id
        });

        for (let nodeA of state.nodes) {
          state.arrows.push({
            x1: nodeA.x,
            y1: nodeA.y,
            x2: node.x,
            y2: node.y
          });
        }
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
