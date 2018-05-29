import _ from 'underscore'
import BigNumber from 'bignumber.js'

import {
  State,
  Address,
  Block,
  Transaction,
  getState,
  setState,
  deleteState
} from './chains'

export const NET = 'testnet.miskre.org'

export const ASSETS = {
  MIS: '0x2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825',
  KRE: '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
}

export const ASSET_HASHES = {
  '0x2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825': 'MIS',
  '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'KRE'
}

export const GENERATION_AMOUNT = [8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
export const GENERATION_LENGTH = 22
export const DECREMENT_INTERVAL = 2000000

export function newAssetTable(def = {}) {
  return _.reduce(ASSET_HASHES, (obj, i) => {
    obj[i] = _.clone(def)
    return obj
  }, {})
}

// implementation ported directly from miskre node source code
export function calculateBonus (claims) {
  let claimedAmount = BigNumber(0)
  _.each(claims, claim => {
    const startHeight = parseInt(claim.start, 10)
    const endHeight = parseInt(claim.end, 10)
    let ustart = ~~(startHeight / DECREMENT_INTERVAL)
    let amount = BigNumber(0)
    if (ustart < GENERATION_LENGTH) {
      let istart = startHeight % DECREMENT_INTERVAL
      let uend = ~~(endHeight / DECREMENT_INTERVAL)
      let iend = endHeight % DECREMENT_INTERVAL
      if (uend >= GENERATION_LENGTH) {
        uend = GENERATION_LENGTH
        iend = 0
      }
      if (iend === 0) {
        uend -= 1
        iend = DECREMENT_INTERVAL
      }
      while (ustart < uend) {
        amount = amount.plus((DECREMENT_INTERVAL - istart) * GENERATION_AMOUNT[ustart])
        ustart += 1
        istart = 0
      }
      amount = amount.plus((iend - istart) * GENERATION_AMOUNT[ustart])
    }
    amount = amount.plus(claim.sysfee)
    claimedAmount = claimedAmount
      .plus(BigNumber(claim.value).multipliedBy(amount))
  })
  return claimedAmount
    .dividedToIntegerBy(100000000)
}

export function findAddressTransactions (address) {
  return Transaction
    .find({
      $or: [
        {vout: {$elemMatch: {address}}},
        {vin_verbose: {$elemMatch: {address}}}
      ]
    })
}

export function findAddressClaimTransactions (address) {
  return Transaction
    .find({
      type: 'ClaimTransaction',
      vout: {$elemMatch: {address}}
    })
}

export function getReceivedTransactions (a, t) {
  const res = newAssetTable([])
  if (typeof t.vout !== 'undefined') {
    _.each(t.vout, (o, i) => {
      if (o.address === a) {
        if (_.contains(ASSETS, o.asset)) {
          res[ASSET_HASHES[o.asset]].push({
            value: o.value,
            index: o.n,
            txid: t.txid
          })
        }
      }
    })
  }
  return res
}

export function getSentTransactions (a, t) {
  const res = newAssetTable([])
  if (typeof t.vin_verbose !== 'undefined') {
    _.each(t.vin_verbose, (o, i) => {
      if (o.address === a) {
        if (_.contains(ASSETS, o.asset)) {
          res[ASSET_HASHES[o.asset]].push({
            value: o.value,
            index: o.n,
            txid: o.txid,
            sending_id: t.txid
          })
        }
      }
    })
  }
  return res
}

export function zipTransactions (txs) {
  const res = newAssetTable()
  _.each(txs, tx => {
    _.each(res, (i, asset) => {
      _.each(tx[asset], t => {
        res[asset][`${t.txid}_${t.index}`] = t
      })
    })
  })
  return res
}

export function getUnspent (sent, received) {
  const res = newAssetTable()
  _.each(res, (i, asset) => {
    _.each(received[asset], (o, txid) => {
      if (!_.some(sent[asset], (v, k) => k === txid)) {
        res[asset][txid] = o
      }
    })
    res[asset] = _.flatten(_.values(res[asset]))
  })
  return res
}

export function getTotals (unspent) {
  const res = newAssetTable()
  _.each(res, (i, asset) => {
    res[asset] = _.reduce(unspent[asset], (sum, j) => {
      return BigNumber(sum).plus(j.value)
    }, 0)
  })
  return res
}

export function computeClaims (claims, transactions, endBlock = false) {
  const diffs = []
  _.each(claims, tx => {
    const res = {
      txid: tx.txid,
      start: transactions[tx.txid].block_index,
      value: tx.value,
      index: tx.index
    }
    if (!endBlock)
      res.end = transactions[tx.sending_id].block_index
    else
      res.end = endBlock
    res.sysfee = 0
    res.claim = calculateBonus([res])
    diffs.push(res)
  })
  return diffs
}
