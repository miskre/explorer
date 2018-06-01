import {each, map} from 'underscore'

export const NET = 'testnet.miskre.org'

export const ASSETS = {
  MIS: {
    symbol: 'MIS',
    name: 'MIS - Governance Token',
    hash: '0x3f2b3196557daee6d249c08ff1c33a07f08655f24bfdf2679d0fd5493396f910',
    total: 20000000000,
    fractionalSize: 0,
    fractionalSize: 0,
    format: '0,0',
    step: 1
  },
  KRE: {
    symbol: 'KRE',
    name: 'KRE - Utility Token',
    hash: '0xa71db467123f2fbd39ad759b1d9f0b7a9375c32555fc357ec348d0cc32af0d2e',
    total: 20000000000,
    fractionalSize: 6,
    format: '0,0.000000',
    step: 0.000001
  }
}

export const ASSET_HASHES = {}
each(ASSETS, a => {
  ASSET_HASHES[a.hash] = a
})

export const GENERATION_AMOUNT = map([8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], a => a * 200)
export const GENERATION_LENGTH = 22
export const DECREMENT_INTERVAL = 2000000