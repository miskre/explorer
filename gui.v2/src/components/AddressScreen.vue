<template lang="pug">
  #slides
    section#explorer.full-height
      .fg
        .safe
          .title(data-aos="fade-left")
            h1 address
          transition(name="fade" mode="out-in")
            loading.tl(v-if="isLoading" text="Synching Address")
            a.bt.a(v-else="isLoading" href="#" @click.prevent="fetch") Refresh
        debug(v-if="address" data-aos="fade-up" :value="address")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import Loading from '@/components/Loading'

export default {
  name: 'AddressScreen',

  metaInfo: {
    title: 'Addresses'
  },

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
      error: null,
      isLoading: true,
      address: null
    }
  },

  methods: {
    fetch () {
      this.address = null
      this.error = null
      this.isLoading = true
      api
        .getAddressByHash(this._id)
        .then(res => Vue.set(this, 'address', res.data))
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
