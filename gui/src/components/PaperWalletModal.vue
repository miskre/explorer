<template lang="pug">
  .modal.paper-wallet
    .header Paper Wallet
      a.x(href="#" @click.prevent="$modal.hide('paper-wallet')") &times;
    .content.p-20(ref="html")
      ul.bg
        li
          .rw
            .cl.md-4
              qr(:text="address" :margin="qrMargin" :size="qrSize")
            .cl.md-8
              label.qr Address
              .store(v-text="address")
        li
          .rw
            .cl.md-4
              qr(:text="publicKey" :margin="qrMargin" :size="qrSize")
            .cl.md-8
              label.qr Public Key
              .store(v-text="publicKey")
        li
          .rw
            .cl.md-4
              qr(:text="privateKey" :margin="qrMargin" :size="qrSize")
            .cl.md-8
              label.qr Private Key
              .store(v-text="privateKey")
              a.link(:href="downloadPrivateKey" :download="privateKeyFileName") Download private key
        li(v-if="nep2")
          .rw
            .cl.md-4
              qr(:text="nep2" :margin="qrMargin" :size="qrSize")
            .cl.md-8
              label.qr Keystore
              .store(v-text="nep2")
              a.link(:href="downloadKeystore" :download="keystoreFileName") Download keystore
</template>

<script>
export default {
  name: 'PaperWalletModal',
  props: {
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
  data () {
    return {
      qrSize: 400,
      qrMargin: 10,
      html: ''
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
  },
  methods: {
    openPrintWindow () {
      const html = this.$refs.html.innerHTML
      const printer = window.open('/', 'Print Paper Wallet', 'width=800,height=600')
      printer.document.write(html)
      printer.print()
    }
  },
  mounted () {
    this.html = this.$refs.html.innerHTML
  }
}
</script>
