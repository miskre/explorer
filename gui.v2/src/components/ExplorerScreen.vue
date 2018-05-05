<template lang="pug">
  #slides
    section#explorer.full-height
      .bg(style="background-image: url(/static/metal.jpeg)")
      .fg
        .title(data-aos="fade-left")
          h1 explorer
        .roll(data-aos="fade-up")
          .rw
            .cl.md-6
              .section-title Latest Blocks
              transition-group.blocks(name="fade" tag="ul")
                li(v-for="b, k in blocks" :key="k")
                  .stamp.block
                    router-link.hash.name(:to="{name: 'Block', params: {_id: b.hash}}" v-text="b.hash")
                    br
                    timeago.time(:since="b.time * 1000")
            .cl.md-6
              .section-title Latest Transactions
              transition-group.transactions(name="fade" tag="ul")
                li(v-for="t, k in transactions" :key="k")
                  .stamp.transaction
                    router-link.txid.name(:to="{name: 'Transaction', params: {_id: t.txid}}" v-text="t.txid")
                    br
                    timeago.time(:since="t.blocktime * 1000")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import {__h} from '@/common/helpers'

export default {
  name: 'Explorer',

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
    fetch () {
      api
        .getStateInfo()
        .then(res => {
          Vue.set(this.info, 'lastBlockIndex', res.data.count)
          Vue.set(this, 'blocks', res.data.blocks)
          Vue.set(this, 'transactions', res.data.transactions)
        })
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
