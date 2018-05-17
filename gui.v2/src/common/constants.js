export const assetHashes = {
  '0x2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825': {
    id: 1,
    name: 'MIS - Governing Token',
    symbol: 'MIS',
    total: 20000000000,
    fractionalSize: 0,
    format: '0,0',
    step: 1
  },
  '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': {
    id: 2,
    name: 'KRE - Utility Token',
    symbol: 'KRE',
    total: 20000000000,
    fractionalSize: 6,
    format: '0,0.000000',
    step: 0.1
  }
}

export const assetSymbols = {
  MIS: '0x2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825',
  KRE: '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
}

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

export function assetByHash (hash) {
  let info = assetHashes[hash]
  if (typeof info === 'undefined') info = undefinedAsset
  info.hash = hash
  return info
}

export function assetBySymbol (symbol) {
  return assetByHash(assetSymbols[symbol])
}
