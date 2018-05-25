export const ENV = process.env.NODE_ENV || 'development'

export const ASSETS = {
  MIS: '0x2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825',
  KRE: '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
}

export const ASSET_HASHES = {
  '0x2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825': 'MIS',
  '0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'KRE'
}

export const RPC_CLIENT = {
  // host: ENV === 'production' ? '127.0.0.1' : '192.168.1.200',
  host: 'explorer.miskre.org',
  port: 10332,
  path: '/',
  strict: true
}

