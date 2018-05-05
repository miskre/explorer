<template lang="pug">
  #slides
    section#explorer.full-height
      .fg
        .title(data-aos="fade-left")
          h1 block
        debug(data-aos="fade-up" :value="block")
</template>

<script>
import Vue from 'vue'
import api from '@/common/api'

export default {
  name: 'BlockScreen',

  computed: {
    _id () {
      return this.$route.params._id
    }
  },

  data () {
    return {
      block: {}
    }
  },

  methods: {
    fetch () {
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
