/*jshint esversion: 6 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      nodes: []
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
      setAllNodesInactiveExcept(state, { exceptId }) {
        for (let node of state.nodes) {
          node.active = node.id == exceptId;
        }
      }
    }
  });
}

export default createStore();
