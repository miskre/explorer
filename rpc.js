import {JSONRPC_BASE_URL} from './settings'
import axios from 'axios'

const rpc = axios.create({
  baseURL: JSONRPC_BASE_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json-rpc'
  }
})

rpc.interceptors.response.use(null, (error) => {
  if (error.config && error.response) {
    console.log(error)
    return rpc.request(error.config)
  }

  return Promise.reject(error);
});

function call(method, params = []) {
  return new Promise((resolve, reject) => {
    rpc.post('/', {
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now()
    })
    .then(res => {
      if (res.data.error) return reject(res.data.error)
      if (res.data.code && res.data.code < 0) return reject(res.data)
      if (res.data.result) return resolve(res.data.result)
      reject(new Error('No result returned.'))
    })
    .catch(e => {
      reject(e)
    })
  })
}

export function getAccountState(params = []) {
  return call('getaccountstate', params)
}

export function getBestBlock(params = []) {
  return call('getbestblock', params)
}

export function getBlockCount(params = []) {
  return call('getblockcount', params)
}

export function getBlock(params = []) {
  return call('getblock', params)
}

export function getRawTransaction(params = []) {
  return call('getrawtransaction', params)
}

export function sendRawTransaction(params = []) {
  return call('sendrawtransaction', params)
}
