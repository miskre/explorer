import express from 'express'
import rpc from 'node-json-rpc'

const router = express.Router()
const node = new rpc.Client({
  host: '192.168.1.25',
  port: 10331,
  path: '/',
  strict: true
})

function getBlockCount(params = []) {
  return new Promise((resolve, reject) => {
    node.call({
      id: 1,
      method: 'getblockcount',
      params
    }, (e, res) => {
      if (e) reject(e)
      else resolve(res.result)
    })
  })
}

function getBlock(params = []) {
  return new Promise((resolve, reject) => {
    node.call({
      id: 1,
      method: 'getblock',
      params
    }, (e, res) => {
      if (e) reject(e)
      else resolve(res.result)
    })
  })
}

function getRawTransaction(params = []) {
  return new Promise((resolve, reject) => {
    node.call({
      id: 1,
      method: 'getrawtransaction',
      params
    }, (e, res) => {
      if (e) reject(e)
      else resolve(res.result)
    })
  })
}

router.get('/', async (req, res) => {
  try {
    const count = await getBlockCount()
    console.log(count)
    const blocks = []
    for (let i = count - 1; i >= Math.max(count - 10, 0); i--) {
      blocks.push(await getBlock([i, 1]))
    }
    res.render('index', {
      count,
      blocks
    })
  } catch (e) {
    console.log(e)
    res.status(500).json('error')
  }
})

router.get('/blocks/:id', async (req, res) => {
  try {
    const block = await getBlock([req.params.id, 1])
    res.render('blocks/view', {
      block
    })
  } catch (e) {
    console.log(e)
    res.status(500).json('error')
  }
})

router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await getRawTransaction([req.params.id, 1])
    res.render('transactions/view', {
      transaction
    })
  } catch (e) {
    console.log(e)
    res.status(500).json('error')
  }
})

export default router