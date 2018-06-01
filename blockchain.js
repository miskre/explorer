import {
  each,
  contains,
  keys,
  reduce,
  clone,
  flatten,
  some,
  values
} from 'underscore'
import async from 'async'
import BigNumber from 'bignumber.js'

import {
  Address,
  Block,
  Transaction,
  getState,
  setState,
  deleteState
} from './storage'

import {
  NET,
  ASSETS,
  ASSET_HASHES,
  GENERATION_AMOUNT,
  GENERATION_LENGTH,
  DECREMENT_INTERVAL
} from './miskre'
import { assertTSAnyKeyword } from 'babel-types';

export function newAssetTable(def = {}) {
  return reduce(ASSET_HASHES, (obj, i) => {
    obj[i.symbol] = clone(def)
    return obj
  }, {})
}

// implementation ported directly from miskre node source code
export function calculateBonus (claims) {
  let claimedAmount = BigNumber(0)
  each(claims, claim => {
    const startHeight = parseInt(claim.start, 10)
    const endHeight = parseInt(claim.end, 10)
    let amount = BigNumber(0)
    let ustart = ~~(startHeight / DECREMENT_INTERVAL)
    if (ustart < GENERATION_LENGTH) {
      let istart = startHeight % DECREMENT_INTERVAL
      let uend = ~~(endHeight / DECREMENT_INTERVAL)
      let iend = endHeight % DECREMENT_INTERVAL
      if (uend >= GENERATION_LENGTH) {
        uend = GENERATION_LENGTH
        iend = 0
      }
      if (iend === 0) {
        uend = uend - 1
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
    .dividedToIntegerBy(ASSETS.KRE.total)
    .toString()
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
    each(t.vout, (o, i) => {
      if (o.address === a) {
        if (contains(keys(ASSET_HASHES), o.asset)) {
          res[ASSET_HASHES[o.asset].symbol].push({
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
    each(t.vin_verbose, (o, i) => {
      if (o.address === a) {
        if (contains(keys(ASSET_HASHES), o.asset)) {
          res[ASSET_HASHES[o.asset].symbol].push({
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
  each(txs, tx => {
    each(res, (i, asset) => {
      each(tx[asset], t => {
        res[asset][`${t.txid}_${t.index}`] = t
      })
    })
  })
  return res
}

export function getUnspent (sent, received) {
  const res = newAssetTable()
  each(res, (i, asset) => {
    each(received[asset], (o, txid) => {
      if (!some(sent[asset], (v, k) => k === txid)) {
        res[asset][txid] = o
      }
    })
    res[asset] = flatten(values(res[asset]))
  })
  return res
}

export function getTotals (unspent) {
  const res = newAssetTable()
  each(res, (i, asset) => {
    res[asset] = reduce(unspent[asset], (sum, j) => {
      return BigNumber(sum).plus(j.value)
    }, 0)
  })
  return res
}

export function filterClaimedForOtherAddress (claims) {
  return new Promise((resolve, reject) => {
    const result = []
    async.eachOf(claims, (claim, key, next) => {
      Transaction
        .findOne({
          type: 'ClaimTransaction',
          claims_keys_v1: {
            $elemMatch: {
              key
            }
          }
        })
        .exec((e, tx) => {
          if (e) return next(e)
          if (!tx) result.push(claim)
          return next(null)
        })
    }, e => {
      if (e) return reject(e)
      return resolve(result)
    })
  })
}

export function computeClaims (claims, transactions, endBlock = false) {
  const diffs = []
  each(claims, async tx => {
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
