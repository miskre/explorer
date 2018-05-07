import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  account: null
}

const getters = {

  isLogged (state) {
    return (state.account !== null)
  },

  account (state) {
    return state.account
  },

  paperWallet (state) {
    if (state.account === null) return null
    if (typeof state.account._encrypted === 'undefined') {
      return {
        type: 'Normal',
        address: state.account.address,
        publicKey: state.account.publicKey,
        privateKey: state.account.privateKey
      }
    } else {
      return {
        type: 'NEP5',
        address: state.account.address,
        publicKey: state.account.publicKey,
        privateKey: state.account.privateKey,
        nep2: state.account.encrypted
      }
    }
  }

}

const actions = {

  loggedIn ({commit}, account) {
    commit(types.ACCOUNT_LOGGED_IN, account)
  },

  loggedOut ({commit}) {
    commit(types.ACCOUNT_LOGGED_OUT)
  }

}

const mutations = {

  [types.ACCOUNT_LOGGED_IN] (state, account) {
    Vue.set(state, 'account', account)
  },

  [types.ACCOUNT_LOGGED_OUT] (state) {
    Vue.set(state, 'account', null)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
