<template lang="pug">
  #slides
    section#explorer.full-height
      .bg.static(style="background-image: url(/static/world.jpeg)")
      .fg
        .safe
          .title(data-aos="fade-left")
            h1 block
          transition(name="fade" mode="out-in")
            loading.tl(v-if="isLoading" text="Syncing Block")
            .navigator(v-else)
              a.bt.a(href="#" @click.prevent="fetch") Refresh
              router-link.previous(v-if="previous" :to="{name: 'Block', params: {_id: previous}}" title="previous") ←
              router-link.next(v-if="next" :to="{name: 'Block', params: {_id: next}}" :title="next") →

        transition(name="fade" mode="out-in")
          div(v-if="block")
            ul.bg.md-2.lg-3
              li
                .card
                  .caption General Information
                  .content
                    .script
                      pre(v-text="block.hash")
                    dl.info
                      dt Index
                      dd(v-text="block.index")
                      dt Size
                      dd(v-text="block.size")
                      dt Version
                      dd(v-text="block.version")
                      dt Time
                      dd
                        timeago.time(:since="block.time * 1000")
                      dt Confirms
                      dd(v-text="block.confirmations")
              li
                .card
                  .caption Scripts
                  .content
                    .script
                      span Invocation
                      pre
                        code(v-text="block.script.invocation")
                    .script
                      span Verification
                      pre
                        code(v-text="block.script.verification")
              li
                .card
                  .caption Transactions
                  .content
                    ul.transactions
                      li(v-for="tx in block.tx")
                        .type(v-text="tx.type")
                        router-link(:to="{name: 'Transaction', params: {_id: tx.txid}}" v-text="__h(tx.txid)")
        .safe
          .navigator
            router-link.previous(v-if="previous" :to="{name: 'Block', params: {_id: previous}}" title="previous") ←
            router-link.next(v-if="next" :to="{name: 'Block', params: {_id: next}}" :title="next") →

        debug(:value="block" v-if="block")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import {__h} from '@/common/helpers'
import Loading from '@/components/Loading'

export default {
  name: 'BlockScreen',

  metaInfo: {
    title: 'blocks'
  },

  components: {
    Loading
  },

  computed: {
    _id () {
      return this.$route.params._id
    },
    previous () {
      if (this.block && this.block.previousblockhash) return this.block.previousblockhash
      return null
    },
    next () {
      if (this.block && this.block.nextblockhash) return this.block.nextblockhash
      return null
    }
  },

  data () {
    return {
      isLoading: false,
      error: null,
      block: null
    }
  },

  methods: {
    __h,
    fetch () {
      this.block = null
      this.error = null
      this.isLoading = true
      api
        .getBlockByHash(this._id)
        .then(res => Vue.set(this, 'block', res.data))
        .catch(e => Vue.set(this, 'error', e))
        .then(req => {
          this.isLoading = false
        })
    }
  },

  watch: {
    _id (last, now) {
      this.fetch()
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
