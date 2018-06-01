<template lang="pug">
  window.paper-wallet(:hook="hook" width="500px")
    .small(slot="title")
      span paper_wallet:
      span(v-text="address")
    div(slot="content")
      scroller.paper-wallet-panel
        .padding.pv-20
          .ctn
            .rw.sp-30
              .cl.md-6
                label Address
                  div
                    qr(:text="address" :margin="10" :size="220")
                    debug(:value="address")
              .cl.md-6
                label Public Key
                  div
                    qr(:text="publicKey" :margin="10" :size="220")
                    debug(:value="publicKey")
            .rw.sp-30
              .cl.md-6
                label Private Key
                  div
                    qr(:text="privateKey" :margin="10" :size="220")
                    debug(:value="privateKey")
                .tr
                  a.link(:href="downloadPrivateKey" :download="privateKeyFileName") Download private key
              .cl.md-6(v-if="nep2")
                label Keystore
                  div
                    qr(:text="nep2" :margin="10" :size="220")
                    debug(:value="nep2")
                .tr
                  a.link(:href="downloadKeystore" :download="keystoreFileName") Download keystore
</template>

<script>
export default {
  name: 'WalletWindow',
  props: {
    hook: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    nep2: {
      type: String
    }
  },
  computed: {
    privateKeyFileName () {
      return 'privatekey.' + this.address + '.txt'
    },
    downloadPrivateKey () {
      return 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.privateKey)
    },
    keystoreFileName () {
      return 'keystore.' + this.address + '.txt'
    },
    downloadKeystore () {
      return 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.nep2)
    }
  }
}
</script>
