import _ from 'underscore'
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
} from './chains'
import {ASSETS, ASSET_HASHES} from './settings'
import * as rpc from './rpc'

function newAssetTable(def = {}) {
  return _.reduce(ASSET_HASHES, (obj, i) => {
    obj[i] = _.clone(def)
    return obj
  }, {})
}

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

router.post('/transactions/send', (req, res) => {
  const tx = req.params.tx
  rpc
    .sendRawTransaction([tx])
    .then(result => {
      res.json(result)
    })
    .catch(e => {
      console.log(e)
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
  Address
    .findOne({_id: req.params.id})
    .exec((e, address) => {
      if (e) {
        console.log(e)
        res.status(500).json(e)
      }
      if (address) res.render(address)
      else res.status(404).json(404)
    })
})

function getReceivedTransactions (a, t) {
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

function getSentTransactions (a, t) {
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

function zipTransactions (txs) {
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

function getUnspent (sent, received) {
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

function getTotals (unspent) {
  const res = newAssetTable()
  _.each(res, (i, asset) => {
    res[asset] = _.reduce(unspent[asset], (sum, j) => {
      return BigNumber(sum).plus(j.value)
    }, 0)
  })
  return res
}

router.get('/addresses/:id/balance', (req, res) => {
  const address = req.params.id
  Transaction
    .find({
      $or: [
        {vout: {$elemMatch: {address}}},
        {vin_verbose: {$elemMatch: {address}}}
      ]
    })
    .exec((e, transactions) => {
      if (e) {
        console.log(e)
        return res.status(500).json(e)
      }
      const sent = zipTransactions(_.map(transactions, t => {
        return getSentTransactions(address, t)
      }))
      const received = zipTransactions(_.map(transactions, t => {
        return getReceivedTransactions(address, t)
      }))
      const unspent = getUnspent(sent, received)
      const totals = getTotals(unspent)
      const state = _.reduce(ASSET_HASHES, (r, a) => {
        r[a] = {
          balance: totals[a],
          unspent: unspent[a]
        }
        return r
      }, {})
      res.json({
        net: 'testnet.miskre.org',
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
  Transaction
    .find({
      $or: [
        {vout: {$elemMatch: {address}}},
        {vin_verbose: {$elemMatch: {address}}}
      ]
    })
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

export default router