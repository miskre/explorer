<template lang="pug">
  .wallet-info
    .address(v-text="address")
    .state(v-if="state")
      a(href="#" @click.prevent="fetch") Refresh
      ul.balances
        li(v-for="b in state.balances")
          .name(v-text="asset(b.asset).name")
          .value
            span.number(v-text="b.value")
            span.symbol(v-text="asset(b.asset).symbol")
</template>

<script>
import Vue from 'vue'
import {asset} from '@/common/constants'
import api from '@/common/api'

export default {
  name: 'WalletInfo',

  props: {
    address: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      state: null
    }
  },

  methods: {
    asset,
    fetch () {
      api.getAccountState(this.address)
        .then(res => Vue.set(this, 'state', res))
        .catch(e => console.log(e))
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
