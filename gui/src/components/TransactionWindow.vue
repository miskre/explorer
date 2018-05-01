<template lang="pug">
  window.home(:hook="hook" width="600px")
    .small(slot="title")
      span transaction:
      span(v-text="__h(current)")
      span.mh-5 —
      timeago(:since="transaction.blocktime * 1000")
    div(slot="content")
      .padding.pv-20
        scroller.transaction-panel
          .ctn
            label Hash
              .hash(v-text="transaction.txid")
            .rw
              .cl.md-3
                label Type
                  .type(v-text="transaction.type")
              .cl.md-3
                label Confirmations
                  .confirmations(v-text="transaction.confirmations")
              .cl.md-3
                label Size
                  .size(v-text="transaction.size")
              .cl.md-3
                label Version
                  .version(v-text="transaction.version")
            .rw
              .cl.md-6
                label.mb-5 Vin
                debug.mb-10(:value="transaction.vin")
              .cl.md-6
                label.mb-5 Vout
                debug.mb-10(:value="transaction.vout")
            .rw
              .cl.md-6
                label.mb-5 Attributes
                debug.mb-10(:value="transaction.attributes")
              .cl.md-6
                label.mb-5 Scripts
                debug.mb-10(:value="transaction.scripts")
            label Block
              div
                a.hash(v-text="__h(transaction.blockhash)" :title="transaction.blockhash" @click="openBlock(transaction.blockhash)")
</template>

<script>
import Vue from 'vue'
import {mapActions} from 'vuex'
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
      current: '',
      transaction: {}
    }
  },
  methods: {
    __h,
    ...mapActions({
      pushWindow: 'ui/pushWindow'
    }),
    fetch () {
      api
        .getTransactionByHash(this.hash)
        .then((res) => {
          Vue.set(this, 'transaction', res.data)
        })
    },
    navigate (hash) {
      Vue.set(this, 'current', hash)
    },
    openBlock (hash) {
      this.pushWindow({
        id: `block-${hash}`,
        type: 'Block',
        params: {hash}
      })
    }
  },
  watch: {
    current (val, old) {
      this.fetch(val)
    }
  },
  mounted () {
    this.navigate(this.hash)
  }
}
</script>
