import axios from 'axios'
import {env} from '@/common/settings'

const rpc = axios.create({
  baseURL: env().rpcRoot
})

rpc.defaults.headers.common['Content-Type'] = 'application/json'

rpc
  .interceptors
  .request
  .use(req => {
    if (req.params) {
      req.params = {jsonrpc: '2.0', params: [], id: 1, ...req.params}
      req.params.params = `[${req.params.params.toString()}]`
    }
    if (req.data) {
      req.data = {jsonrpc: '2.0', params: [], id: 1, ...req.data}
      req.data.params = `[${req.data.params.toString()}]`
    }
    return req
  }, e => {
    return Promise.reject(e)
  })

rpc
  .interceptors
  .response
  .use(res => {
    if (res.data.result) return res.data.result
    return res
  }, e => {
    return Promise.reject(e)
  })

export default rpc

export function call (method, params) {
  return rpc.get('/', {
    method,
    params
  })
}
