<template lang="pug">
  .wallet-claim(v-if="account")
    a.bt.a(href="#" @click.prevent="claim") Claim
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {__n} from '@/common/helpers'
import Neon from '@/common/neon'
import api, {hex2txid} from '@/common/api'
import {assetBySymbol} from '@/common/constants'
import Asset from '@/components/Asset'
import Loading from '@/components/Loading'

window.Neon = Neon

export default {
  name: 'WalletClaim',

  components: {
    Asset,
    Loading
  },

  computed: {
    ...mapGetters({
      account: 'users/account',
      claims: 'users/claims'
    }),
    _claims () {
      if (this.claims === null) return null
      return Neon.create.claimTx(this.claims)
    }
  },

  data () {
    return {
      isClaiming: false
    }
  },

  methods: {
    __n,
    assetBySymbol,
    ...mapActions({
      updateState: 'users/updateState'
    }),

    done (txid) {
      this.$modal.show('dialog', {
        title: 'Claim Transaction Sent',
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

    claim () {
      this.$modal.show('dialog', {
        title: 'Claim KRE Confirm',
        text: `Do you really want to claim current KRE?`,
        buttons: [{
          title: 'Send',
          handler: () => {
            this.doClaim()
            this.$modal.hide('dialog')
          }
        }, {
          title: 'Cancel',
          default: true
        }]
      })
    },

    doClaim () {
      this.isClaiming = true
      const tx = Neon.create.claimTx(this.account.address, this.claims)
      Neon.sign.transaction(tx, this.account.privateKey)
      const txid = tx.hash
      const serializedTx = tx.serialize()
      console.log('tx', serializedTx)
      api.sendRawTransaction(serializedTx)
        .then(res => {
          this.done(txid)
        })
        .catch(e => {
          console.error(e)
        })
        .then(req => {
          this.isClaiming = false
        })
    }
  }
}
</script>
