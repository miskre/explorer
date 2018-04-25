import * as types from '../mutation-types'
import Vue from 'vue'

const environments = {
  development: {
    apiRoot: 'http://localhost:3000'
  },
  staging: {
    apiRoot: 'http://localhost:3000'
  },
  production: {
    apiRoot: 'http://localhost:3000'
  }
}

const state = {
  environment: 'development',
  environments,
  initialized: null,
  windows: {}
}

// getters
const getters = {

  environment (state) {
    return state.environment
  },

  windows (state) {
    return state.windows
  },

  apiRoot (state) {
    switch (state.environment) {
      case 'development':
      case 'staging':
      case 'production':
        return state.environments[state.environment].api
      default:
        return state.environments['development'].api
    }
  }

}

// actions
const actions = {

  init ({ commit, dispatch }) {
    // dispatch('sync')
    commit(types.INITIALIZED)
  },

  switchEnvironment ({ commit }, env) {
    commit(types.ENVIRONMENT_SWITCHED, env)
  },

  pushWindow ({ commit }, win) {
    commit(types.WINDOW_PUSHED, win)
  }

}

// mutations
const mutations = {

  [types.INITIALIZED] (state) {
    state.environments = { ...environments }
    state.initialized = new Date()
  },

  [types.ENVIRONMENT_SWITCHED] (state, env) {
    window.localStorage.environment = env
    state.environment = env
  },

  [types.WINDOW_PUSHED] (state, win) {
    Vue.set(state.windows, win.id, win)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
