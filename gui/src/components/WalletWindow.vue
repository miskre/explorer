<template lang="pug">
  window.home(:hook="hook" width="360px")
    .big(slot="title")
      em wallet
      img.logo(src="../assets/logo.svg")
    div(slot="content")
      scroller.info-panel
        ul.info-bar
          li
            .name Status
            .value Testing
          li
            .name Network
            .value Testnet
      scroller.wallet-panel
        .padding.pv-20
          form#generate-key(@submit.stop.prevent="generateKey")
            label Password &mdash; Optional
              input(:type="showPassword ? 'text' : 'password'" v-model="password" autocomplated="off")
            .rw
              .cl.sm-6.tl
                label.mb-5(for="show-password") Show password
              .cl.sm-6.tr
                .sw.ib.mb-0
                  input#show-password(type="checkbox" v-model="showPassword")
                  label(for="show-password")
            .memo Generate private key will take a while with ecryption mode on.
            .tr
              button.bt.a.mb-10(type="submit") create
</template>

<script>
import {mapActions} from 'vuex'
import {wallet} from '@cityofzion/neon-js'

export default {
  name: 'WalletWindow',
  props: {
    hook: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      password: '',
      showPassword: false
    }
  },
  methods: {
    ...mapActions({
      pushWindow: 'ui/pushWindow'
    }),
    generateWallet () {

    },
    generateKey () {
      const a = new wallet.Account()
      const w = {
        type: 'Nomral',
        address: a.address,
        privateKey: a.privateKey,
        publicKey: a.publicKey
      }
      if (this.password.length > 0) {
        w.nep2 = wallet.encrypt(wallet.private, this.password)
        w.type = 'NEP2'
      }
      this.openPaperWallet(w)
    },
    openPaperWallet (params) {
      this.pushWindow({
        id: `paper-wallet-${params.address}`,
        type: 'PaperWallet',
        params
      })
    }
  }
}
</script>
