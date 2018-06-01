import {
  each,
  map,
  reduce,
  isUndefined
} from 'underscore'
import express from 'express'
import async from 'async'
import BigNumber from 'bignumber.js'

import {
  State,
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
} from './miskre'

import {
  newAssetTable,
  calculateBonus,
  findAddressTransactions,
  findAddressClaimTransactions,
  filterClaimedForOtherAddress,
  getReceivedTransactions,
  getSentTransactions,
  zipTransactions,
  getUnspent,
  getTotals,
  computeClaims,
} from './blockchain'

import * as rpc from './rpc'

const router = express.Router()

router.get('/', async (req, res) => {
  const count = await getState('lastBlockHeight')
  async.parallel({
    blocks: (cb) => {
      Block
        .find({})
        .sort({time: -1})
        .limit(10)
        .exec(cb)
    },
    transactions: (cb) => {
      Transaction
        .find({})
        .sort({blocktime: -1})
        .limit(10)
        .exec(cb)
    }
  }, (e, data) => {
    if (e) {
      console.log(e)
      return res.status(500).json(500)
    }
    res.json({
      count,
      ...data
    })
  })
})

router.get('/height', async (req, res) => {
  const count = await getState('lastBlockHeight')
  res.json(count)
})

router.get('/assets', async (req, res) => {
  async.mapValues(ASSETS, (asset, name, cb) => {
    rpc.getAssetState([asset.hash])
      .then(result => {
        cb(null, result)
      })
      .catch(cb)
  }, (e, result) => {
    if (e) {
      console.log(e)
      return res.send(501).json(e)
    }
    res.json(result)
  })
})

router.post('/transactions/send', (req, res) => {
  const tx = req.body.tx
  console.log('tx', tx)
  rpc
    .sendRawTransaction([tx])
    .then(result => {
      res.json(result)
    })
    .catch(e => {
      console.error(e)
      res.status(403).json(e)
    })
})

router.get('/_blocks/:id', async (req, res) => {
  Block
    .findOne({_id: req.params.id})
    .exec((e, block) => {
      if (e) {
        console.log(e)
        res.status(500).json(e)
      }
      if (block) res.json(block)
      else res.status(404).json(404)
    })
})

router.get('/blocks/:id', async (req, res) => {
  rpc.getBlock([req.params.id, 1])
    .then(result => {
      res.json(result)
    })
    .catch(e => {
      res.status(404).json(e)
    })
})

router.get('/_transactions/:id', async (req, res) => {
  Transaction
    .findOne({_id: req.params.id})
    .exec((e, transaction) => {
      if (e) {
        console.log(e)
        res.status(500).json(e)
      }
      if (transaction) res.json(transaction)
      else res.status(404).json(404)
    })
})

router.get('/transactions/:id', async (req, res) => {
  rpc.getRawTransaction([req.params.id, 1])
    .then(result => {
      res.json(result)
    })
    .catch(e => {
      res.status(404).json(e)
    })
})

router.get('/addresses/:id', async (req, res) => {
  const address = req.params.id
  rpc.getAccountState([address])
    .then(result => {
      res.json(result)
    })
    .catch(e => {
      res.status(400).json(e)
    })
})

router.get('/addresses/:id/balance', (req, res) => {
  const address = req.params.id
  findAddressTransactions(address)
    .exec((e, transactions) => {
      if (e) {
        console.log(e)
        return res.status(500).json(e)
      }
      const sent = zipTransactions(map(transactions, t => {
        return getSentTransactions(address, t)
      }))
      const received = zipTransactions(map(transactions, t => {
        return getReceivedTransactions(address, t)
      }))
      const unspent = getUnspent(sent, received)
      const totals = getTotals(unspent)
      const state = reduce(ASSET_HASHES, (result, asset) => {
        result[asset.symbol] = {
          balance: totals[asset.symbol],
          unspent: unspent[asset.symbol]
        }
        return result
      }, {})
      res.json({
        net: NET,
        address,
        // sent,
        // received,
        // unspent,
        // totals,
        ...state
      })
    })
})

router.get('/addresses/:id/history', (req, res) => {
  const address = req.params.id
  findAddressTransactions(address)
    .sort({
      blocktime: -1
    })
    .limit(20)
    .exec((e, transactions) => {
      if (e) {
        console.log(e)
        return res.status(500).json(e)
      }
      res.json(transactions)
    })
})

router.get('/addresses/:id/claims', (req, res) => {
  const address = req.params.id
  async.parallel({
    transactions (cb) {
      findAddressTransactions(address).exec(cb)
    },
    claimed (cb) {
      findAddressClaimTransactions(address).exec(cb)
    },
    height (cb) {
      rpc.getBlockCount()
        .then(result => {
          cb(null, result)
        })
        .catch(e => cb(e, 0))
    }
  }, async (e, data) => {
    if (e) {
      console.log(e)
      return res.status(500).json(e)
    }
    try {
      // reformat transactions array to object
      const transactions = reduce(data.transactions, (o, tx) => {
        o[tx.txid] = tx
        return o
      }, {})
      // sent MIS info
      const sent = zipTransactions(map(data.transactions, t => {
        return getSentTransactions(address, t)
      }))
      const received = zipTransactions(map(data.transactions, t => {
        return getReceivedTransactions(address, t)
      }))
      const unspent = getUnspent(sent, received)
      // past claimed tx
      const claimed = reduce(data.claimed, (o, tx) => {
        each(tx.claims, c => {
          o[`${c.txid}_${c.vout}`] = tx
        })
        return o
      }, {})
      let validClaims = {}
      each(sent.MIS, (tx, txid) => {
        if (isUndefined(claimed[txid])) validClaims[txid] = tx
      })
      validClaims = await filterClaimedForOtherAddress(validClaims)
      const blockDiffs = computeClaims(validClaims, transactions)
      const unspentDiffs = computeClaims(unspent.MIS, transactions, data.height)
      res.json({
        net: NET,
        address,
        // sent,
        // received,
        // unspent,
        // claimed,
        claims: blockDiffs,
        available: calculateBonus(blockDiffs),
        unavailable: calculateBonus(unspentDiffs)
      })
    } catch (e) {
      console.log(e)
    }
  })
})

export default router