import axios from 'axios'
import rpc, {call} from '@/common/rpc'

const api = axios.create({
  baseURL: 'http://localhost:3000'
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
  return rpc.post('/', {
    params: {
      method: 'sendrawtransaction',
      params: [tx]
    }
  })
}

export default api
