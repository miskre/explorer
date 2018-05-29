<template lang="pug">
  #slides
    section#explorer.full-height
      .fg
        .title(data-aos="fade-left")
          h1 transaction
        transition(name="fade" mode="out-in")
          loading.tl(v-if="isLoading" text="Synching Transaction")
          a.bt.a(v-else="isLoading" href="#" @click.prevent="fetch") Refresh
        .ab.w(v-if="!isConfirmed") This transaction have no confirmations yet. It will be processed by the blockchain soon.
        debug(v-if="transaction" data-aos="fade-up" :value="transaction")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
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
