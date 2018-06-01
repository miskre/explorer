<template lang="pug">
  .asset
    span.integer(v-text="__n(integer)")
    span.point(v-if="asset.fractionalSize > 0") .
    span.fractional(v-text="fractional")
    span.symbol(v-text="asset.symbol")
</template>

<script>
import BigNumber from 'bignumber.js'
import {assetBySymbol, assetByHash} from '@/common/blockchain'
import {__n} from '@/common/helpers'

export default {
  name: 'Asset',
  props: {
    value: {
      required: true
    },
    hash: {
      required: false
    },
    symbol: {
      required: false
    }
  },
  computed: {
    asset () {
      if (typeof this.hash !== 'undefined') return assetByHash(this.hash)
      return assetBySymbol(this.symbol)
    },
    number () {
      return BigNumber(this.value)
    },
    integer () {
      return this.number
        .integerValue(BigNumber.ROUND_DOWN)
        .toString()
    },
    fractional () {
      if (this.asset.fractionalSize <= 0) return null
      if (!this.number) return 0
      return this.number
        .minus(this.integer)
        .multipliedBy(Math.pow(10, this.asset.fractionalSize))
        .integerValue(BigNumber.ROUND_DOWN)
        .toString()
    }
  },
  methods: {
    __n
  }
}
</script>
