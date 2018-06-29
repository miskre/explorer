import {each} from 'underscore'
import async from 'async'
import express from 'express'

import {
  Block,
  Transaction,
  getState,
  setState,
  deleteState
} from './models'

import * as rpc from './rpc'

const router = express.Router()
let syncInterval = null
let isSyncing = false

async function lookupTransaction(_id) {
  return new Promise(async (resolve, reject) => {
    Transaction
      .findOne({_id})
      .exec((e, tx) => {
        if (e) return reject(e)
        else return resolve(tx)
      })
  })
}

async function syncTransaction(hash, index) {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = await rpc.getRawTransaction([hash, 1])
      transaction.block_index = index
      // contract transaction
      if (typeof transaction.vin !== 'undefined') {
        const verbose = []
        each(transaction.vin, async (vin) => {
          const ref = await lookupTransaction(vin.txid)
          if (ref) {
            const res = ref.vout[vin.vout]
            res.txid = vin.txid
            verbose.push(res)
          }
        })
        transaction.vin_verbose = verbose
      }
      // claim transaction
      if (typeof transaction.claims !== 'undefined') {
        const claims = []
        const keys = []
        each(transaction.claims, async (claim) => {
          keys.push(`${claim.txid}_${claim.vout}`)
          const ref = await lookupTransaction(claim.txid)
          if (ref) {
            const res = ref.vout[claim.vout]
            res.txid = claim.txid
            claims.push(res)
          }
        })
        transaction.claims_verbose = claims
        transaction.claims_keys_v1 = keys
      }
      // store into database
      Transaction.update({ _id: transaction.txid }, { _id: transaction.txid, ...transaction }, { upsert: true }, (e, res) => {
        if (e) reject(e)
        else resolve(res)
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function syncBlock(index) {
  return new Promise(async (resolve, reject) => {
    try {
      const block = await rpc.getBlock([index, 1])
      for (let i in block.tx) {
        console.log('transaction.sync: ' + block.tx[i].txid)
        await syncTransaction(block.tx[i].txid, block.index)
      }
      Block.update({ _id: block.hash }, { _id: block.hash, ...block }, { upsert: true }, (e, res) => {
        if (e) reject(e)
        else resolve(res)
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function syncChain() {
  if (isSyncing) return
  isSyncing = true
  try {
    const currentHeight = await rpc.getBlockCount()
    const lastBlockHeight = await getState('lastBlockHeight', 0)
    console.log('block.status: ' + lastBlockHeight + '/' + currentHeight)
    if (currentHeight > lastBlockHeight) {
      for (let i = lastBlockHeight; i < currentHeight; i ++) {
        console.log('block.sync: ' + (i + 1) + '/' + currentHeight)
        await syncBlock(i)
        await setState('lastBlockHeight', i)
      }
    }
  } catch (e) {
    console.error(e)
  }
  isSyncing = false
}

async function firstBlock() {
  const block = await rpc.getBlock([0, 1])
  console.log(JSON.stringify(block, null, 2))
}

// firstBlock()
syncInterval = setInterval(syncChain, 5000)

export default router
