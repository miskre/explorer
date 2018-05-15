<template lang="pug">
  .wallet-transfer
    form#transfer(@submit.stop.prevent="send")
      .rw.sp-10
        .cl.sm-8
          label Amount
            input(type="number" :min="min" :max="max" v-model="amount" @keyup="validate" required)
        .cl.sm-4
          label Asset
            select(v-model="assetHash" @change="validate" required)
              option(v-for="a, hash in assetHashes" v-text="a.symbol" :value="hash")
      .rw
        .cl
          .help.mt-10 Current balance:&nbsp;
            asset.max(:value="max" :symbol="symbol" @click.native="fulfill")
      .rw
        .cl
          label To Address
            input(type="text" v-model="toAddress" required)
      .memo Double check the address. If you send to wrong address, the assets will gone forever.
      button.bt.a.mb-0(type="submit") Send
</template>

<script>
import _ from 'underscore'
import {mapGetters, mapActions} from 'vuex'
import {__n} from '@/common/helpers'
import {assetHashes, assetByHash} from '@/common/constants'
import Neon, {rpc, wallet} from '@cityofzion/neon-js'
import api from '@/common/api'
import Asset from '@/components/Asset'

Neon.CONST.ASSETS = {
  '2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825': 'MIS',
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'KRE',
  MIS: 'MIS',
  KRE: 'KRE'
}
Neon.CONST.ASSET_ID = {
  MIS: '2d0f3149aedeae16511c3bc72a339a0cf70eed1bd67a909bbc4b66b91875b825',
  KRE: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
}

Neon.add.network(new rpc.Network({
  name: 'miskre',
  extra: {
    neonDB: 'http://192.168.1.12:8000'
  }
}))

export default {
  name: 'WalletTransfer',

  components: {
    Asset
  },

  data () {
    return {
      assetHashes,
      amount: 1,
      assetHash: assetHashes[0],
      toAddress: 'AVsQo1FG9sTkvTuTi5o71z56rjxAaF5Db9'
    }
  },

  computed: {
    ...mapGetters({
      account: 'users/account',
      balance: 'users/balance'
    }),
    type () {
      return assetByHash(this.assetHash)
    },
    min () {
      return 0
    },
    max () {
      if (this.balance === null) return 0
      const selected = this.balance[this.symbol]
      if (typeof selected === 'undefined') return 0
      return selected.balance
    },
    symbol () {
      return assetByHash(this.assetHash).symbol
    },
    _balance () {
      if (this.balance === null) return null
      const res = new wallet.Balance({
        net: this.balance.net,
        address: this.balance.address
      })
      _.each(this.balance, (v, k) => {
        if (k === 'net' || k === 'address') return
        res.addAsset(k, v)
      })
      return res
    }
  },

  methods: {
    __n,
    assetByHash,
    ...mapActions({
      updateState: 'ui/updateState'
    }),

    fulfill () {
      this.amount = this.max
    },

    validate () {
      if (this.amount < this.min) this.amount = this.min
      if (this.amount > this.max) this.amount = this.max
    },

    send () {
      this.$modal.show('dialog', {
        title: 'Send asset confirm',
        text: `Do you really want to send ${__n(this.amount)} ${this.symbol} to "${this.toAddress}"?`,
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
      let tx = Neon.create.tx({type: 128})
      tx.addOutput(this.symbol, this.amount, this.toAddress)
        .addRemark(`send ${this.amount}${this.symbol}`)
        .calculate(this._balance)
        .sign(this.account.privateKey)
      const hash = tx.hash
      console.log('hash', hash)
      const serializedTx = tx.serialize()
      console.log('tx', serializedTx)
      api.sendRawTransaction(serializedTx)
        .then(res => console.log(res))
        .catch(e => console.log(e))
      return true
    }

  }
}
</script>
