<template lang="pug">
  #slides
    section#explorer.full-height
      .fg
        .title(data-aos="fade-left")
          h1 block
        transition(name="fade" mode="out-in")
          loading.tl(v-if="!block" text="Synching Block")
          debug(v-else data-aos="fade-up" :value="block")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'
import Loading from '@/components/Loading'

export default {
  name: 'BlockScreen',

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
      block: null
    }
  },

  methods: {
    fetch () {
      this.block = null
      api
        .getBlockByHash(this._id)
        .then(res => {
          Vue.set(this, 'block', res.data)
        })
    }
  },

  mounted () {
    this.fetch()
  }
}
</script>
