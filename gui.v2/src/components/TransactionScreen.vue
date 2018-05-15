<template lang="pug">
  #slides
    section#explorer.full-height
      .fg
        .title(data-aos="fade-left")
          h1 transaction
        transition(name="fade" mode="out-in")
        loading.tl(v-if="!transaction" text="Synching Transaction")
        debug(v-else data-aos="fade-up" :value="transaction")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import Loading from '@/components/Loading'

export default {
  name: 'TransactionScreen',

  components: {
    Loading
  },

  computed: {
    _id () {
      return this.$route.params._id
    }
  },

  data () {
    return {
      transaction: null
    }
  },

  methods: {
    fetch () {
      this.transaction = null
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
