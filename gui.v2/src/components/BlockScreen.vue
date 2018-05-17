<template lang="pug">
  #slides
    section#explorer.full-height
      .fg
        .title(data-aos="fade-left")
          h1 block
        transition(name="fade" mode="out-in")
          loading.tl(v-if="isLoading" text="Synching Block")
          a.bt.a(v-else href="#" @click.prevent="fetch") Refresh
        transition(name="fade" mode="out-in")
          loading.tl(v-if="!block" text="Synching Block")
          debug(v-else-if="block" data-aos="fade-up" :value="block")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
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
    _id: this.fetch
  },

  mounted () {
    this.fetch()
  }
}
</script>
