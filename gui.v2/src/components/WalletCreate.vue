<template lang="pug">
  .wallet-create
    form#generate-key(@submit.stop.prevent="generate")
      label Password &mdash; Optional
        input(:type="showPassword ? 'text' : 'password'" v-model="password" autocomplated="off")
      .rw
        .cl.sm-6.tl
          label.mb-5(for="show-password") Show password
        .cl.sm-6.tr
          .sw.ib.mb-0.rd
            input#show-password(type="checkbox" v-model="showPassword")
            label(for="show-password")
      .memo Generate private key will take a while with ecryption mode on.
      button.bt.a.mb-0(type="submit") Create
</template>

<script>
import {wallet} from '@cityofzion/neon-js'
import PaperWalletModal from '@/components/PaperWalletModal'

export default {
  name: 'WalletCreate',

  data () {
    return {
      password: '',
      showPassword: false
    }
  },

  methods: {

    clear () {
      this.password = ''
      this.showPassword = false
    },

    generate () {
      const a = new wallet.Account()
      const w = {
        type: 'Normal',
        address: a.address,
        privateKey: a.privateKey,
        publicKey: a.publicKey
      }
      if (this.password.length > 0) {
        w.nep2 = wallet.encrypt(wallet.private, this.password)
        w.type = 'NEP2'
      }
      this.clear()
      this.openPaperWallet(w)
    },

    openPaperWallet (w) {
      this.$modal.show(PaperWalletModal, w, {
        name: 'paper-wallet',
        title: 'Paper Wallet',
        draggable: '.header',
        maxWidth: 500,
        height: 'auto',
        adaptive: true,
        scrollable: true,
        classes: 'paper-wallet-modal'
      })
    }

  }

}
</script>
