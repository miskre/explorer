import * as types from '../mutation-types'
import Vue from 'vue'
import _ from 'underscore'

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

  z (state) {
    return (id) => {
      const win = state.windows[id]
      if (!win || typeof win.z === 'undefined') return 0
      return win.z
    }
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

  pushWindow ({ commit, dispatch }, win) {
    commit(types.WINDOW_PUSHED, win)
    dispatch('focusWindow', win.id)
  },

  focusWindow ({ commit }, id) {
    commit(types.WINDOW_FOCUSED, id)
  },

  destroyWindow ({ commit }, id) {
    commit(types.WINDOW_DESTROYED, id)
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
    if (typeof win.z === 'undefined') win.z = 0
    Vue.set(state.windows, win.id, win)
  },

  [types.WINDOW_FOCUSED] (state, id) {
    if (!state.windows[id]) return
    _.each(_.sortBy(state.windows, 'z'), (w, z) => {
      Vue.set(state.windows[w.id], 'z', z)
    })
    Vue.set(state.windows[id], 'z', _.size(state.windows))
  },

  [types.WINDOW_DESTROYED] (state, id) {
    Vue.set(state.windows[id], 'destroyed', true)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
