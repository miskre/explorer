<template lang="pug">
  window.home(:hook="hook")
    .big(slot="title")
      em explorer
      img.logo(src="../assets/logo.svg")
    div(slot="content")
      scroller.info-panel
        ul.info-bar
          li
            .name Block Height
            .value(v-text="info.lastBlockIndex")
          li
            .name Secs Per Block
            .value(v-text="15")
      .padding.pv-30
        .rw
          .cl.lg-6
            .part-title Latest Blocks
            scroller.blocks-panel
              ul.blocks
                li(v-for="b in blocks")
                  .stamp.block
                    .hash.name(v-text="__h(b.hash)" @click.stop="openBlock(b.hash)")
                    timeago.time(:since="b.time * 1000")
          .cl.lg-6
            .part-title Latest Transactions
            scroller.transactions-panel
              ul.transactions
                li(v-for="t in transactions")
                  .stamp.transaction
                    .txid.name(v-text="__h(t.txid)" @click.stop="openTransaction(t.txid)")
                    timeago.time(:since="t.blocktime * 1000")
</template>

<script>
import Vue from 'Vue'
import {mapActions} from 'vuex'
import api from '../common/api'
import {__h} from '../common/helpers'

export default {
  name: 'ExplorerWindow',
  props: {
    hook: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      info: {
        lastBlockIndex: 0
      },
      blocks: [],
      transactions: []
    }
  },
  methods: {
    __h,
    ...mapActions({
      pushWindow: 'ui/pushWindow'
    }),
    fetch () {
      api
        .getStateInfo()
        .then((res) => {
          Vue.set(this.info, 'lastBlockIndex', res.data.count)
          Vue.set(this, 'blocks', res.data.blocks)
          Vue.set(this, 'transactions', res.data.transactions)
        })
    },
    openBlock (hash) {
      this.pushWindow({
        id: `block-${hash}`,
        type: 'Block',
        params: {hash}
      })
    },
    openTransaction (hash) {
      this.pushWindow({
        id: `transaction-${hash}`,
        type: 'Transaction',
        params: {hash}
      })
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>
