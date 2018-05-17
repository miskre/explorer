<template lang="pug">
  #slides
    section#explorer.full-height
      .bg(style="background-image: url(/static/world.jpeg)")
      .fg
        .title(data-aos="fade-left")
          h1 explorer
        .roll(data-aos="fade-up")
          .rw
            .cl.md-6
              .card
                .caption Latest Blocks
                .content
                  transition(name="fade" mode="out-in")
                    loading(v-if="!blocks" text="Synching Blocks")
                    transition-group.blocks(v-else name="fade" tag="ul")
                      li(v-for="b, k in blocks" :key="k")
                        .stamp.block
                          router-link.hash.name(:to="{name: 'Block', params: {_id: b.hash}}" v-text="b.hash")
                          timeago.time(:since="b.time * 1000")
            .cl.md-6
              .card
                .caption Latest Transactions
                .content
                  transition(name="fade" mode="out-in")
                    loading(v-if="!blocks" text="Synching Trnsactions")
                    transition-group.transactions(v-else name="fade" tag="ul")
                      li(v-for="t, k in transactions" :key="k")
                        .stamp.transaction
                          router-link.txid.name(:to="{name: 'Transaction', params: {_id: t.txid}}" v-text="t.txid")
                          timeago.time(:since="t.blocktime * 1000")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import {__h} from '@/common/helpers'
import Loading from '@/components/Loading'

export default {
  name: 'Explorer',

  metaInfo: {
    title: 'explorer'
  },

  components: {
    Loading
  },

  data () {
    return {
      info: {
        lastBlockIndex: 0
      },
      blocks: null,
      transactions: null
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
