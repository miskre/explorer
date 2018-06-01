import Vue from 'vue'
import {each, map} from 'underscore'
import * as types from '../mutation-types'
import api from '@/common/api'
import {txid2hex} from '@/common/blockchain'

const state = {
  account: null,
  balance: null,
  claims: null
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

  claims (state) {
    return state.claims
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
    commit(types.BALANCE_UPDATED, null)
    api.getAddressBalance(state.account.address)
      .then(res => {
        each(res.data, (v, k) => {
          if (k === 'net' || k === 'address') return
          if (v.unspent) {
            v.unspent = map(v.unspent, i => {
              if (i.txid) i.txid = txid2hex(i.txid)
              return i
            })
          }
        })
        commit(types.BALANCE_UPDATED, res.data)
      })
      .catch(e => console.log(e))
  },

  updateClaims ({state, commit}) {
    if (state.account === null) return
    commit(types.CLAIMS_UPDATED, null)
    api.getAddressClaims(state.account.address)
      .then(res => {
        if (res.data.claims) {
          res.data.claims = map(res.data.claims, i => {
            if (i.txid) i.txid = txid2hex(i.txid)
            return i
          })
        }
        commit(types.CLAIMS_UPDATED, res.data)
      })
      .catch(e => console.log(e))
  },

  updateState ({state, dispatch, commit}) {
    dispatch('updateBalance')
    dispatch('updateClaims')
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
  },

  [types.CLAIMS_UPDATED] (state, claims) {
    Vue.set(state, 'claims', claims)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
