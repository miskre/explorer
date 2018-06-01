import axios from 'axios'
import {env} from '@/common/settings'

const api = axios.create({
  baseURL: env().apiRoot
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

api.getAddressBalance = (address) => {
  return api.get(`/addresses/${address}/balance`)
}

api.getAddressClaims = (address) => {
  return api.get(`/addresses/${address}/claims`)
}

api.getAddressHistory = (address) => {
  return api.get(`/addresses/${address}/history`)
}

api.getBlockCount = () => {
  return api.get('/height')
}

api.sendRawTransaction = (tx) => {
  return api.post('/transactions/send', {tx})
}

export default api
