<template lang='pug'>
  .wallet-transfer
    form#transfer(@submit.stop.prevent='send')
      .rw.sp-10
        .cl.sm-8
          label Amount
            input(type='number' :min='min' :max='max' v-model='amount' @keyup='validate' required)
            .help.mt-10 Current balance:&nbsp;
              span.max(v-text='__n(max) + asset(assetHash).symbol')
        .cl.sm-4
          label Asset
            select(v-model='assetHash' @change='validate' required)
              option(v-for='a, hash in assetTypes' v-text='a.symbol' :value='hash')
          debug(:value="assetHash")
      .rw
        .cl
          label To Address
            input(type='text' v-model="toAddress" required)
      .memo Double check the address. If you send to wrong address, the assets will gone forever.
      button.bt.a.mb-0(type='submit') Send
</template>

<script>
import _ from 'underscore'
import {mapGetters} from 'vuex'
import {assetTypes, asset} from '@/common/constants'
import {__n} from '@/common/helpers'
import Neon, {rpc, api} from '@cityofzion/neon-js'
import _api from '@/common/api'

window.Neon = Neon
Neon.CONST.ASSETS = {
  '2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825': 'NEO',
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'GAS',
  NEO: 'NEO',
  GAS: 'GAS'
}
Neon.CONST.ASSET_ID = {
  NEO: '2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825',
  GAS: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
}

Neon.add.network(new rpc.Network({
  name: 'miskre',
  extra: {
    neonDB: 'http://192.168.1.12:8000'
  }
}))

window.Neon = Neon

export default {
  name: 'WalletTransfer',

  props: {
    wallet: {
      required: true
    }
  },

  data () {
    return {
      assetTypes,
      amount: 0,
      assetHash: assetTypes[0],
      toAddress: ''
    }
  },

  computed: {
    ...mapGetters({
      accountState: 'users/accountState'
    }),
    type () {
      return asset(this.assetHash)
    },
    min () {
      return 0
    },
    max () {
      if (this.accountState === null) return 0
      const selected = _.find(this.accountState.balances, {asset: this.assetHash})
      if (typeof selected === 'undefined') return 0
      return selected.value
    }
  },

  methods: {
    __n,
    asset,

    validate () {
      if (this.amount < this.min) this.amount = this.min
      if (this.amount > this.max) this.amount = this.max
    },

    send () {
      console.log('send')
      this.$modal.show('dialog', {
        title: 'Send asset confirm',
        text: `Do you really want to send ${__n(this.amount)} ${asset(this.assetHash).symbol} to "${this.toAddress}"?`,
        buttons: [{
          title: 'Send',
          handler: () => this.doSend()
        }, {
          title: 'Cancel',
          default: true
        }]
      })
    },

    async doSend () {
      const balance = await api.neonDB
        .getBalance('miskre', 'AGZ7iKLzaEfUoMCobSkpRMH3287LQu6cMw')
      console.log(JSON.stringify(balance, null, 2))
      let tx = Neon.create.tx({type: 128})
      tx.addOutput('GAS', 1, 'AVsQo1FG9sTkvTuTi5o71z56rjxAaF5Db9')
        .addRemark('Send 1 GAS to AVsQo1FG9sTkvTuTi5o71z56rjxAaF5Db9')
        .calculate(balance)
        .sign(this.wallet.privateKey)
      const hash = tx.hash
      console.log(hash)
      const serializedTx = tx.serialize(true)
      _api.sendRawTransaction(serializedTx)
        .then(res => console.log(res))
        .catch(e => console.log(e))
    }

  }
}
</script>
