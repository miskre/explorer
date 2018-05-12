import Vue from 'vue'
import * as types from '../mutation-types'
import api from '@/common/api'

const state = {
  account: null,
  accountState: null
}

const getters = {

  isLogged (state) {
    return (state.account !== null)
  },

  account (state) {
    return state.account
  },

  accountState (state) {
    return state.accountState
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

  loggedIn ({commit, dispatch}, account) {
    commit(types.ACCOUNT_LOGGED_IN, account)
    dispatch('updateAccountState')
  },

  updateAccountState ({state, commit}) {
    if (state.account === null) return
    api.getAccountState(state.account.address)
      .then(res => {
        commit(types.ACCOUNT_STATE_UPDATED, res)
      })
      .catch(e => console.log(e))
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
  },

  [types.ACCOUNT_STATE_UPDATED] (state, accountState) {
    Vue.set(state, 'accountState', accountState)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
