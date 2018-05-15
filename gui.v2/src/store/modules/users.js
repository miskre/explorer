import Vue from 'vue'
import _ from 'underscore'
import * as types from '../mutation-types'
import api, {txid2hex} from '@/common/api'

const state = {
  account: null,
  balance: null
}

const getters = {

  isLogged (state) {
    return (state.account !== null)
  },

  account (state) {
    return state.account
  },

  balance (state) {
    return state.balance
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
    dispatch('updateState')
  },

  updateBalance ({state, commit}) {
    if (state.account === null) return
    state.balance = null
    api.getAddressBalance(state.account.address)
      .then(res => {
        _.each(res.data, (v, k) => {
          if (k === 'net' || k === 'address') return
          if (v.unspent) {
            v.unspent = _.map(v.unspent, i => {
              if (i.txid) i.txid = txid2hex(i.txid)
              return i
            })
          }
        })
        commit(types.BALANCE_UPDATED, res.data)
      })
      .catch(e => console.log(e))
  },

  updateState ({state, dispatch, commit}) {
    dispatch('updateBalance')
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

  [types.BALANCE_UPDATED] (state, balance) {
    Vue.set(state, 'balance', balance)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
