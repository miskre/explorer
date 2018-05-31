<template lang="pug">
  .wallet-transfer
    form#transfer(@submit.stop.prevent="send" :disabled="isSending")
      .rw
        .cl
          label To Address
            input(type="text" v-model="toAddress" v-validate="_toAddress" name="toAddress")
          .errors(v-if="errors.has('toAddress')") Please enter a valid wallet address
      .rw.sp-10
        .cl.sm-4
          label Asset
            select(v-model="assetHash" required)
              option(v-for="a, hash in assetHashes" v-text="a.symbol" :value="hash")
        .cl.sm-8
          label Amount
            input(type="number" :min="min" :max="max" :step="step" v-model="amount" v-validate="_amount" name="amount")
          .errors(v-text="errors.first('amount')")
      .rw
        .cl
          transition(name="fade" mode="out-in")
            .help.mv-10(v-if="assetHash") Current balance:&nbsp;
              a(href="#" @click.prevent="fulfill")
                asset.max(:value="max" :symbol="symbol")
            .help.mv-10(v-else) Select an asset to send
      .memo Double check the address. If you send to wrong address, the assets will gone forever.
      transition(name="fade" mode="out-in")
        loading(:text="sendingText" v-if="isSending")
        button.bt.a.mb-0(type="submit" v-else) Send
</template>

<script>
import _ from 'underscore'
import {mapGetters, mapActions} from 'vuex'
import {__n} from '@/common/helpers'
import {assetHashes, assetByHash} from '@/common/constants'
import Neon, {wallet} from '@/common/neon'
import api, {hex2txid} from '@/common/api'
import Loading from '@/components/Loading'
import Asset from '@/components/Asset'

export default {
  name: 'WalletTransfer',

  components: {
    Loading,
    Asset
  },

  data () {
    return {
      assetHashes,
      amount: 0,
      assetHash: null,
      isSending: false,
      toAddress: ''
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
      if (this.balance === null) return Infinity
      const selected = this.balance[this.symbol]
      if (typeof selected === 'undefined') return Infinity
      return selected.balance
    },
    step () {
      return this.type.step
    },
    symbol () {
      return assetByHash(this.assetHash).symbol
    },
    sendingText () {
      return `Sending ${__n(this.amount, this.type.format)} ${this.symbol}...`
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
    },
    _toAddress () {
      return {
        required: true,
        alpha_num: true
      }
    },
    _amount () {
      return {
        required: true,
        decimal: this.type.fractionalSize,
        min_value: this.min,
        max_value: this.max
      }
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

    clear () {
      this.address = ''
      this.amount = 0
    },

    send () {
      this.$modal.show('dialog', {
        title: 'Send asset confirm',
        text: `Do you really want to send ${__n(this.amount, this.type.format)} ${this.symbol} to "${this.toAddress}"?`,
        buttons: [{
          title: 'Send',
          handler: () => {
            this.doSend()
            this.$modal.hide('dialog')
          }
        }, {
          title: 'Cancel',
          default: true
        }]
      })
    },

    done (txid) {
      this.$modal.show('dialog', {
        title: 'Asset Sent',
        text: `Your transaction is being broadcasted to testnet. Transaction ID: ${txid}`,
        buttons: [{
          title: 'View',
          handler: () => {
            this.$modal.hide('dialog')
            this.$router.push({
              name: 'Transaction',
              params: {
                _id: hex2txid(txid)
              }
            })
          }
        }, {
          title: 'Close',
          default: true
        }]
      })
    },

    error (e) {
      console.error(e)
      this.$modal.show('dialog', {
        title: 'Transaction Denied',
        text: 'Your transaction signing script is denied from the testnet.',
        buttons: [{
          title: 'Resend'
        }, {
          title: 'Cancel',
          default: true
        }]
      })
    },

    async doSend () {
      this.isSending = true
      let tx = Neon.create.tx({type: 128})
      tx.addOutput(this.symbol, this.amount, this.toAddress)
        // .addRemark(`send ${this.amount}${this.symbol}`)
        .calculate(this._balance)
        .sign(this.account.privateKey)
      const txid = tx.hash
      const serializedTx = tx.serialize()
      console.log('tx', serializedTx)
      api.sendRawTransaction(serializedTx)
        .then(res => {
          this.clear()
          this.done(txid)
        })
        .catch(e => {
          this.error(e)
        })
        .then(req => {
          this.isSending = false
        })
      return true
    }
  }
}
</script>
