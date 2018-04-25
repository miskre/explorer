<template lang="pug">
  window.home(:hook="hook" width="500px")
    .small(slot="title")
      span transaction:
      span(v-text="__h(hash)")
    div(slot="content")
      scroller.transaction-panel
        debug(:value="transaction")
</template>

<script>
import Vue from 'vue'
import api from '../common/api'
import {__h} from '../common/helpers'

export default {
  name: 'TransactionWindow',
  props: {
    hook: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      transaction: {}
    }
  },
  methods: {
    __h,
    fetch () {
      api
        .getTransactionByHash(this.hash)
        .then((res) => {
          Vue.set(this, 'transaction', res.data)
        })
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>
