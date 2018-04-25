<template lang="pug">
  window.home(:hook="hook" width="500px")
    .small(slot="title")
      span block:
      span(v-text="__h(hash)")
    div(slot="content")
      scroller.block-panel
        debug(:value="block")
</template>

<script>
import Vue from 'Vue'
import api from '../common/api'
import {__h} from '../common/helpers'

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
      block: {}
    }
  },
  methods: {
    __h,
    fetch () {
      api
        .getBlockByHash(this.hash)
        .then((res) => {
          Vue.set(this, 'block', res.data)
        })
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>
