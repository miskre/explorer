<template lang="pug">
  window.home(:hook="hook" width="600px")
    .small(slot="title")
      span block:
      span(v-text="__h(current)")
      span.mh-5 —
      timeago(:since="block.time * 1000")
    div(slot="content")
      .padding.pv-20
        scroller.block-panel
          .ctn
            label Hash
              .hash(v-text="block.hash")
            .rw
              .cl.md-3
                label Index
                  .index(v-text="block.index")
              .cl.md-3
                label Size
                  .size(v-text="block.size")
              .cl.md-3
                label Version
                  .version(v-text="block.version")
              .cl.md-3
                label Confirmations
                  .confirmations(v-text="block.confirmations")
            .scripts(v-if="block.script")
              .rw
                .cl.md-6
                  label Invocation
                    pre.invocation
                      code(v-text="block.script.invocation")
                .cl.md-6
                  label Verification
                    pre.verification
                      code(v-text="block.script.verification")
            .part-title Transactions
            ul.transactions
              li(v-for="t in block.tx")
                .rw
                  .cl.md-3
                    .type(v-text="t.type")
                  .cl.md-9
                    a.hash(v-text="__h(t.txid)" :title="t.txid" @click="openTransaction(t.txid)")
            .navigations
              a.previous(v-if="block.previousblockhash" v-text="__h(block.previousblockhash)" :title="block.previousblockhash" @click="navigate(block.previousblockhash)")
              a.next(v-if="block.nextblockhash" v-text="__h(block.nextblockhash)" :title="block.nextblockhash" @click="navigate(block.nextblockhash)")
</template>

<script>
import Vue from 'vue'
import {mapActions} from 'vuex'
import api from '@/common/api'
import {__h} from '@/common/helpers'

export default {
  name: 'BlockWindow',
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
      block: {},
      current: ''
    }
  },
  methods: {
    __h,
    ...mapActions({
      pushWindow: 'ui/pushWindow'
    }),
    fetch (hash) {
      api
        .getBlockByHash(hash)
        .then(res => {
          Vue.set(this, 'block', res.data)
        })
    },
    navigate (hash) {
      Vue.set(this, 'current', hash)
    },
    openTransaction (hash) {
      this.pushWindow({
        id: `transaction-${hash}`,
        type: 'Transaction',
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
