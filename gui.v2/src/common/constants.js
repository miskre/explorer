export const assetTypes = {
  '0x2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825': {
    id: 1,
    name: 'MIS - Governing Token',
    symbol: 'MIS',
    total: 20000000000,
    fractionalSize: 0
  },
  '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': {
    id: 2,
    name: 'KRE - Utility Token',
    symbol: 'KRE',
    total: 20000000000,
    fractionalSize: 6
  }
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

export function asset (hash) {
  let info = assetTypes[hash]
  if (typeof info === 'undefined') {
    info = {
      id: -1,
      name: 'Unknown',
      symbol: '???'
    }
  }
  info.hash = hash
  return info
}
