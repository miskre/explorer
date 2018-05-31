<template lang="pug">
  #slides
    section#explorer.full-height
      .bg.static(style="background-image: url(/static/magazine.jpeg)")
      .fg
        .safe
          .title(data-aos="fade-left")
            h1 wallet
          .tabs(data-aos="fade-down")
            router-link(:to="{name: 'WalletImport'}" :class="{a: tab === 'WalletImport'}" v-text="isLogged ? 'Your Wallet' : 'Import'")
            router-link(:to="{name: 'WalletCreate'}" :class="{a: tab === 'WalletCreate'}") Create
            router-link(:to="{name: 'WalletFaqs'}" :class="{a: tab === 'WalletFaqs'}") FAQs

        router-view
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'WalletScreen',

  metaInfo: {
    title: 'wallet'
  },

  computed: {
    ...mapGetters({
      isLogged: 'users/isLogged'
    }),
    tab () {
      return this.$route.name
    }
  }
}
</script>
