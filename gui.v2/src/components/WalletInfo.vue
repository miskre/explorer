<template lang="pug">
  .wallet-info(v-if="account")
    .address
      span.hash.mr-10(v-text="account.address")
      a(href="#" @click.prevent="updateState")
        icon(name="sync")
    .state
      transition(name="fade" mode="out-in")
        loading(v-if="balance === null" text="Synching Balances")
        ul.balances.mv-15(v-else)
          li(v-for="b, k in balance" v-if="['net', 'address'].indexOf(k) === -1")
            .name(v-text="assetBySymbol(k).name")
            asset(:value="b.balance" :symbol="k")
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {__n} from '@/common/helpers'
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
      balance: 'users/balance'
    })
  },

  methods: {
    __n,
    assetBySymbol,
    ...mapActions({
      updateState: 'users/updateState'
    })
  }
}
</script>
