import axios from 'axios'
import rpc, {call} from '@/common/rpc'

const api = axios.create({
  baseURL: '/api'
})

api.getStateInfo = () => {
  return api.get('/')
}

api.getTransactionByHash = (hash) => {
  return api.get(`/transactions/${hash}`)
}

api.getBlockByHash = (hash) => {
  return api.get(`/blocks/${hash}`)
}

api.getAddressByHash = (hash) => {
  return api.get(`/addresses/${hash}`)
}

api.getAccountState = (address) => {
  return call('getaccountstate', [address])
}

api.getAddressBalance = (address) => {
  return api.get(`/addresses/${address}/balance`)
}

api.getAddressHistory = (address) => {
  return api.get(`/addresses/${address}/history`)
}

api.getVersion = () => {
  return rpc.get('/', {
    params: {
      method: 'getversion'
    }
  })
}

api.getBlockCount = () => {
  return rpc.get('/', {
    params: {
      method: 'getblockcount'
    }
  })
}

api.sendRawTransaction = (tx) => {
  return call('sendrawtransaction', [tx])
}

export function txid2hex (s) {
  if (s.startsWith('0x')) return s.substr(2)
  return s
}

export function hex2txid (s) {
  if (!s.startsWith('0x')) return '0x' + s
}

export default api
