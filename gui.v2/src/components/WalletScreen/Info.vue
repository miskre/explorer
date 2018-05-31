<template lang="pug">
  .wallet-info(v-if="account")
    .address
      span.hash.mr-10(v-text="account.address")
      a(href="#" @click.prevent="updateState")
        icon(name="sync")
    .state
      transition(name="fade" mode="out-in")
        loading(v-if="balance === null" text="Syncing Balances")
        ul.balances.mv-15(v-else)
          li(v-for="b, k in balance" v-if="['net', 'address'].indexOf(k) === -1")
            .name(v-text="assetBySymbol(k).name")
            .status(v-if="k === 'KRE'")
              .rw
                .cl.sm-4 Current
                .cl.sm-8.tr
                  asset(:value="b.balance" :symbol="k")
              template(v-if="claims")
                .rw
                  .cl.sm-4
                    a(href="#" @click.prevent="claim" v-if="isClaimable") Claimable
                    span(v-else) No claimable
                  .cl.sm-8.tr
                    asset(:value="claims.available" :symbol="k")
                .rw
                  .cl.sm-4 Unavailable
                  .cl.sm-8.tr
                    asset(:value="claims.unavailable" :symbol="k")
            asset(v-else :value="b.balance" :symbol="k")
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {__n} from '@/common/helpers'
import Neon from '@/common/neon'
import api, {hex2txid} from '@/common/api'
import {assetBySymbol} from '@/common/constants'
import Asset from '@/components/Asset'
import Loading from '@/components/Loading'

export default {
  name: 'WalletInfo',

  components: {
    Asset,
    Loading
  },

  computed: {
    ...mapGetters({
      account: 'users/account',
      balance: 'users/balance',
      claims: 'users/claims'
    }),
    isClaimable () {
      if (this.claims === null) return false
      return parseFloat(this.claims.available) > 0
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

    error (e) {
      let message = 'Error during claim asset claiming!'
      this.$modal.hide('dialog')
      this.isClaiming = false
      switch (e.message) {
        case 'Useless transaction! There is no claims!':
          message = 'There is no claimable asset. Please try again later.'
          break
        default:
          message = 'Error during claim your asset.'
      }
      if (message) {
        this.$modal.show('dialog', {
          title: 'Claim Transaction Error',
          text: message,
          buttons: [{
            title: 'Close',
            default: true
          }]
        })
      }
    },

    claim () {
      this.$modal.show('dialog', {
        title: 'Claim KRE Confirm',
        text: `Do you really want to claim current KRE?`,
        buttons: [{
          title: 'Send',
          handler: () => {
            this.$modal.hide('dialog')
            this.doClaim()
          }
        }, {
          title: 'Cancel',
          default: true
        }]
      })
    },

    doClaim () {
      try {
        this.isClaiming = true
        const tx = Neon.create.claimTx(this.account.address, this.claims)
        Neon.sign.transaction(tx, this.account.privateKey)
        const txid = tx.hash
        const serializedTx = tx.serialize()
        console.log('tx', serializedTx)
        api.sendRawTransaction(serializedTx)
          .then(res => {
            if (res.data) this.done(txid)
            else this.error()
          })
          .catch(this.error)
          .then(req => {
            this.isClaiming = false
          })
      } catch (e) {
        this.error(e)
      }
    }
  },

  mounted () {
    this.updateState()
  }
}
</script>
