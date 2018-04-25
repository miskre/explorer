import axios from 'axios'

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

export default api
