<template lang="pug">
  .modal.wallet-history
    .header Wallet history
      a.x(href="#" @click.stop.prevent="$modal.hide('wallet-history')") &times;
    .content.p-20
      transition(name="fade" mode="out-in")
        loading(v-if="!transactions" text="Syncing Trnsactions")
        transition-group.transactions(v-else name="fade" tag="ul")
          li(v-for="t, k in transactions" :key="k")
            .stamp.transaction
              router-link.txid.name(:to="{name: 'Transaction', params: {_id: t.txid}}" v-text="t.txid")
              timeago.time(:since="t.blocktime * 1000")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import Loading from '@/components/Loading'

export default {
  name: 'WalletHistoryModal',

  components: {
    Loading
  },

  props: {
    address: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      transactions: []
    }
  },

  methods: {
    fetch () {
      api.getAddressHistory(this.address)
        .then(res => Vue.set(this, 'transactions', res.data))
        .catch(e => console.log(e))
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
