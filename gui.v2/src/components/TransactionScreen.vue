<template lang="pug">
  #slides
    section#explorer.full-height
      .bg.static(style="background-image: url(/static/world.jpeg)")
      .fg
        .safe
          .title(data-aos="fade-left")
            h1 transaction
          transition(name="fade" mode="out-in")
            loading.tl(v-if="isLoading" text="Syncing Transaction")
            a.bt.a(v-else="isLoading" href="#" @click.prevent="fetch") Refresh
          .ab.w(v-if="!isConfirmed") This transaction have no confirmations yet. It will be processed by the blockchain soon.

        transition(name="fade" mode="out-in")
          div(v-if="transaction")
            ul.bg.md-2.lg-3
              li
                .card
                  .caption General Information
                  .content
                    .script
                      pre(v-text="transaction.txid")
                    dl.info
                      dt Size
                      dd(v-text="transaction.size")
                      dt Type
                      dd(v-text="transaction.type")
                      dt Version
                      dd(v-text="transaction.version")
                      dt Sysfee
                      dd(v-text="transaction.sys_fee")
                      dt Netfee
                      dd(v-text="transaction.net_fee")
                      dt Confirms
                      dd(v-text="transaction.confirmations")
              li
                .card
                  .caption Scripts
                  .content
                    .script
                      span Attributes
                      pre
                        code(v-text="transaction.attributes")
                    .script
                      span Vin
                      pre
                        code(v-text="transaction.vin")
                    .script.mb-0
                      span Vout
                      pre
                        code(v-text="transaction.vout")
              li(v-if="transaction.blockhash")
                .card
                  .caption Block Info
                  .content
                    ul.blocks
                      li
                        router-link.name.hash(:to="{name: 'Block', params: {_id: transaction.blockhash}}" v-text="__h(transaction.blockhash)")
                        timeago.time(:since="transaction.blocktime * 1000")

        debug(v-if="transaction" data-aos="fade-up" :value="transaction")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import {__h} from '@/common/helpers'
import Loading from '@/components/Loading'

export default {
  name: 'TransactionScreen',

  metaInfo: {
    title: 'transactions'
  },

  components: {
    Loading
  },

  computed: {
    _id () {
      return this.$route.params._id
    },
    isConfirmed () {
      if (this.transaction === null) return true
      if (this.transaction.confirmations) return true
      return false
    }
  },

  data () {
    return {
      error: null,
      isLoading: true,
      transaction: null
    }
  },

  methods: {
    __h,
    fetch () {
      this.transaction = null
      this.error = null
      this.isLoading = true
      api
        .getTransactionByHash(this._id)
        .then(res => Vue.set(this, 'transaction', res.data))
        .catch(e => Vue.set(this, 'error', e))
        .then(req => {
          this.isLoading = false
        })
    }
  },

  watch: {
    _id () {
      this.fetch()
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
