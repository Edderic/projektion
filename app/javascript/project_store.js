/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      nodes: [],
    },
    mutations: {
      initialState(
        state,
        {
          nodes
        }
      ) {
        state.nodes = nodes;
      },
      addNode(state, node) {
        state.nodes.push(node);

        this.commit('setAllNodesInactiveExcept', {
          exceptId: node.id
        });
      },

      // 1. might be good to make 35 not duplicated
      //
      // 2. Might be good to have nodes be a dictionary
      // so we don't have to search
      //  - had issues with doing so; nodes weren't showing up
      dropNode(state, { id, x, y }) {
        for (let node of state.nodes) {
          if (node.id == id) {
            node.x = x;
            node.y = y;
          }
        }
      },

      dragNode(state, { id, x, y }) {
        for (let node of state.nodes) {
          if (node.id == id) {
            node.x = x;
            node.y = y;
          }
        }
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
