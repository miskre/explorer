<template lang="pug">
  .roll(data-aos="fade-up")

    transition(name="fade" mode="out-in")
      ul.bg.md-2.lg-3
        template(v-if="isLogged")
          li
            .card
              .caption Wallet Manage
              .content
                info
                ul.links
                  li
                    a.link(href="#" @click.stop.prevent="openWalletHistory(account.address)") Transactions History
                  li
                    a.link(href="#" @click.stop.prevent="openPaperWallet(paperWallet)") Paper Wallet
                  li
                    a.link(href="#" @click.stop.prevent="logout") End Session
          li
            .card
              .caption Transfer
              .content
                transfer
          li
            .card
              .caption Generate New Keystore
              .content
                generate-keystore(:wallet="account")
        template(v-else)
          li
            .card
              .caption Import Your Wallet
              .content
                form#login(@submit.stop.prevent="login")
                  label Keystore
                    .file
                      input(type="file" @change="openKeystore")
                  .error(v-if="error" v-text="error")
                  div(v-if="passwordNeeded")
                    label Password &mdash; Required
                      input(type="password" v-model="password" required)
                    button.bt.a.mb-0(type="submit") Import
</template>

<script>
import Vue from 'vue'
import {mapActions, mapGetters} from 'vuex'
import {wallet} from '@cityofzion/neon-js'
import WalletInfo from '@/components/WalletScreen/Info'
import WalletTransfer from '@/components/WalletScreen/Transfer'
import WalletGenerateKeystore from '@/components/WalletScreen/GenerateKeystore'
import PaperWalletModal from '@/components/PaperWalletModal'
import WalletHistoryModal from '@/components/WalletHistoryModal'

export default {
  name: 'WalletImportFragment',

  metaInfo: {
    title: 'wallet'
  },

  components: {
    info: WalletInfo,
    transfer: WalletTransfer,
    generateKeystore: WalletGenerateKeystore
  },

  data () {
    return {
      tab: 'import',
      buffer: null,
      passwordNeeded: false,
      error: null,
      password: ''
    }
  },

  computed: {
    ...mapGetters({
      account: 'users/account',
      accountState: 'users/accountState',
      isLogged: 'users/isLogged',
      paperWallet: 'users/paperWallet'
    })
  },

  methods: {
    ...mapActions({
      loggedIn: 'users/loggedIn',
      loggedOut: 'users/loggedOut',
      updateAccountState: 'users/updateAccountState'
    }),

    checkKeystore (key) {
      try {
        const account = new wallet.Account(key)
        Vue.set(this, 'buffer', account)
        account.getPublicKey()
        this.login()
      } catch (e) {
        switch (e.message) {
          case 'Private Key encrypted!':
            this.passwordNeeded = true
            this.error = 'Password is needed for this keystore.'
            break
          default:
            this.error = 'Keystore error. Please re-select a correct keystore file'
        }
      }
    },

    openKeystore (e) {
      this.clear()
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = res => this.checkKeystore(res.target.result)
      reader.readAsText(file, 'UTF-8')
    },

    clear () {
      this.buffer = null
      this.password = ''
      this.passwordNeeded = false
      this.error = null
    },

    login () {
      if (this.passwordNeeded) {
        try {
          const password = this.password
          const decrypted = this.buffer.decrypt(password)
          this.loggedIn(decrypted)
          this.clear()
        } catch (e) {
          switch (e.message) {
            case 'Wrong Password!':
              this.error = 'The entered password is invalid for this keystore file.'
              break
            default:
              console.log(e)
              this.error = 'Decrypt error. Please re-check your input.'
          }
        }
      } else {
        this.loggedIn(this.buffer)
        this.clear()
      }
    },

    logout () {
      this.clear()
      this.loggedOut()
    },

    openPaperWallet (wallet) {
      this.$modal.show(PaperWalletModal, wallet, {
        name: 'paper-wallet',
        title: 'Paper Wallet',
        draggable: '.header',
        maxWidth: 500,
        height: 'auto',
        adaptive: true,
        scrollable: true,
        classes: 'paper-wallet-modal'
      })
    },

    openWalletHistory (address) {
      this.$modal.show(WalletHistoryModal, {
        address
      }, {
        name: 'wallet-history',
        title: 'Wallet History',
        draggable: '.header',
        maxWidth: 500,
        height: 'auto',
        adaptive: true,
        scrollable: true,
        classes: 'wallet-history-modal'
      })
    }
  },

  mounted () {
    if (this.isLogged) this.tab = 'import'
  }
}
</script>
