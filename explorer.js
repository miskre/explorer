import express from 'express'
import async from 'async'
import {
  State,
  Address,
  Block,
  Transaction,
  getState,
  setState,
  deleteState
} from './chains'

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

router.get('/blocks/:id', async (req, res) => {
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

router.get('/transactions/:id', async (req, res) => {
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

export default router