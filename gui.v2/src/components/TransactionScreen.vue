<template lang="pug">
  #slides
    section#explorer.full-height
      .fg
        .title(data-aos="fade-left")
          h1 transaction
        debug(data-aos="fade-up" :value="transaction")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'

export default {
  name: 'TransactionScreen',

  computed: {
    _id () {
      return this.$route.params._id
    }
  },

  data () {
    return {
      transaction: {}
    }
  },

  methods: {
    fetch () {
      api
        .getTransactionByHash(this._id)
        .then(res => {
          Vue.set(this, 'transaction', res.data)
        })
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
