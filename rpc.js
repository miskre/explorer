import rpc from 'node-json-rpc'
const node = new rpc.Client({
  host: '192.168.1.5',
  port: 10331,
  path: '/',
  strict: true
})

export function getAccountState(params = []) {
  return new Promise((resolve, reject) => {
    node.call({
      id: 1,
      method: 'getaccountstate',
      params
    }, (e, res) => {
      if (e) reject(e)
      else resolve(res.result)
    })
  })
}

export function getBestBlock(params = []) {
  return new Promise((resolve, reject) => {
    node.call({
      id: 1,
      method: 'getbestblock',
      params
    }, (e, res) => {
      if (e) reject(e)
      else resolve(res.result)
    })
  })
}

export function getBlockCount(params = []) {
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

export function getBlock(params = []) {
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

export function getRawTransaction(params = []) {
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