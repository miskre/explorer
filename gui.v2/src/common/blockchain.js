import {reduce} from 'underscore'
import Neon, {wallet} from '@cityofzion/neon-js'
import {
  ASSETS,
  ASSET_HASHES
} from '../../../miskre'

export const assetHashes = ASSET_HASHES

export const assetSymbols = reduce(assetHashes, (res, asset) => {
  res[asset.symbol] = asset.hash
  return res
}, {})

export const transactionTypes = [
  'MinerTransaction',
  'IssueTransaction',
  'ClaimTransaction',
  'EnrollmentTransaction',
  'RegisterTransaction',
  'ContractTransaction',
  'PublishTransaction',
  'InvocationTransaction'
]

const undefinedAsset = {
  id: -1,
  name: 'Unknown',
  symbol: '___',
  fractionalSize: 2,
  format: '0,0.00'
}

Neon.CONST.ASSETS = {
  ...reduce(ASSETS, (res, asset) => {
    res[txid2hex(asset.hash)] = asset.symbol
    return res
  }, {}),
  ...reduce(ASSETS, (res, asset) => {
    res[asset.symbol] = asset.symbol
    return res
  }, {}),
  NEO: 'MIS',
  GAS: 'KRE'
}

Neon.CONST.ASSET_ID = {
  ...reduce(ASSETS, (res, asset) => {
    res[asset.symbol] = txid2hex(asset.hash)
    return res
  }, {}),
  NEO: txid2hex(ASSETS.MIS.hash),
  GAS: txid2hex(ASSETS.KRE.hash)
}

console.log(Neon.CONST)

export default Neon
export {
  wallet
}

export function assetByHash (hash) {
  let info = assetHashes[hash]
  if (typeof info === 'undefined') info = undefinedAsset
  info.hash = hash
  return info
}

export function assetBySymbol (symbol) {
  return assetByHash(assetSymbols[symbol])
}

export function txid2hex (s) {
  if (s.startsWith('0x')) return s.substr(2)
  return s
}

export function hex2txid (s) {
  if (!s.startsWith('0x')) return '0x' + s
}
