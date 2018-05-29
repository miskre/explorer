import Neon, {wallet} from '@cityofzion/neon-js'

Neon.CONST.ASSETS = {
  '2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825': 'MIS',
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'KRE',
  MIS: 'MIS',
  KRE: 'KRE',
  NEO: 'MIS',
  GAS: 'KRE'
}

Neon.CONST.ASSET_ID = {
  MIS: '2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825',
  KRE: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
  NEO: '2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825',
  GAS: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
}

export default Neon
export {
  wallet
}
