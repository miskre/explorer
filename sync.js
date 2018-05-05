import express from 'express'
import {
  State,
  Block,
  Transaction,
  Address,
  getState,
  setState,
  deleteState
} from './chains'

import * as rpc from './rpc'

const router = express.Router()
let syncInterval = null
let isSyncing = false

async function syncTransaction(hash) {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = await rpc.getRawTransaction([hash, 1])
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
        await syncTransaction(block.tx[i].txid)
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
  isSyncing = false
}

async function firstBlock() {
  const block = await rpc.getBlock([0, 1])
  console.log(JSON.stringify(block, null, 2))
}

syncInterval = setInterval(syncChain, 10000)
// firstBlock()

export default router
