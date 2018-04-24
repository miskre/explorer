<template lang="pug">
  .home
    window
      .big(slot="title")
        em explorer
        img.logo(src="../assets/logo.svg")
      div(slot="content")
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
              ul.blocks
                li(v-for="b in blocks")
                  .stamp.block
                    .hash.name(v-text="__h(b.hash)")
                    timeago.time(:since="b.time * 1000")
            .cl.lg-6
              .part-title Latest Transactions
              ul.transactions
                li(v-for="t in transactions")
                  .stamp.transaction
                    .txid.name(v-text="__h(t.txid)")
                    timeago.time(:since="t.blocktime * 1000")
</template>

<script>
import Vue from 'Vue'
import api from '../common/api'
import {__h} from '../common/helpers'
import Window from './Window'

export default {
  name: 'HelloWorld',
  components: {
    Window
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
    fetchStateInfo () {
      api
        .getStateInfo()
        .then((res) => {
          Vue.set(this.info, 'lastBlockIndex', res.data.count)
          Vue.set(this, 'blocks', res.data.blocks)
          Vue.set(this, 'transactions', res.data.transactions)
        })
    }
  },
  mounted () {
    this.fetchStateInfo()
  }
}
</script>
