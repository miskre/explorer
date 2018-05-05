<template lang="pug">
  #slides
    section#explorer.full-height
      .bg(style="background-image: url(/static/window.jpeg)")
      .fg
        .title(data-aos="fade-left")
          h1 wallet

        .tabs(data-aos="fade-down")
          a(:class="{a: tab === 'import'}" href="#" @click.prevent="tab = 'import'" v-text="isLogged ? 'Your Wallet' : 'Import'")
          a(:class="{a: tab === 'create'}" href="#" @click.prevent="tab = 'create'") Create

        .roll(data-aos="fade-up")

          transition(name="fade" mode="out-in")

            ul.bg.md-2.lg-3(v-if="tab === 'import'" key="import")
              template(v-if="isLogged")
                li
                  .card
                    .caption Wallet Manage
                    .content
                      ul.links
                        li
                          a.link(@click.stop.prevent="openPaperWallet(paperWallet)") Paper Wallet
                        li
                          a.link(@click.stop.prevent="logout") Log out
                li
                  .card
                    .caption Generate New Keystore
                    .content
                      form#new-keystore(@submit.stop.prevent="generateKeystore")
                        label Password &mdash; Required
                          input(:type="newKeystoreShowPassword ? 'text' : 'password'" v-model="newKeystorePassword" required)
                        .rw
                          .cl.sm-6.tl
                            label.mb-5(for="show-password") Show password
                          .cl.sm-6.tr
                            .sw.ib.mb-0.rd
                              input#new-keystore-show-password(type="checkbox" v-model="newKeystoreShowPassword")
                              label(for="new-keystore-show-password")
                        .memo Generate new keystore will take a while with ecryption mode on.
                        button.bt.a.mb-0(type="submit") download
              template(v-else)
                li
                  .card
                    .caption Import Your Wallet
                    .content
                      form#login(@submit.stop.prevent="login")
                        label Keystore
                          .file
                            input(type="file" @change="openKeystore")
                        .error(v-if="loginError" v-text="loginError")
                        div(v-if="loginPasswordNeeded")
                          label Password &mdash; Required
                            input(type="password" v-model="loginPassword" required)
                          button.bt.a.mb-0(type="submit") login

            ul.bg.md-2.lg-3(v-else="tab === 'create'" key="create")
              li
                .card
                  .caption Create New Wallet
                  .content
                    form#generate-key(@submit.stop.prevent="generateKey")
                      label Password &mdash; Optional
                        input(:type="createShowPassword ? 'text' : 'password'" v-model="createPassword" autocomplated="off")
                      .rw
                        .cl.sm-6.tl
                          label.mb-5(for="show-password") Show password
                        .cl.sm-6.tr
                          .sw.ib.mb-0.rd
                            input#create-show-password(type="checkbox" v-model="createShowPassword")
                            label(for="create-show-password")
                      .memo Generate private key will take a while with ecryption mode on.
                      button.bt.a.mb-0(type="submit") create
</template>

<script>
import Vue from 'vue'
import {mapActions, mapGetters} from 'vuex'
import {wallet} from '@cityofzion/neon-js'

window.wallet = wallet

export default {
  name: 'WalletScreen',

  data () {
    return {
      tab: 'create',
      buffer: null,
      createPassword: '',
      createShowPassword: false,
      loginPasswordNeeded: false,
      loginError: null,
      loginPassword: '',
      newKeystorePassword: '',
      newKeystoreShowPassword: false
    }
  },

  computed: {
    ...mapGetters({
      account: 'users/account',
      isLogged: 'users/isLogged',
      paperWallet: 'users/paperWallet'
    })
  },

  methods: {
    ...mapActions({
      loggedIn: 'users/loggedIn',
      loggedOut: 'users/loggedOut'
    }),

    checkKeystore (key) {
      try {
        this.loginError = null
        this.loginPassword = ''
        const account = new wallet.Account(key)
        Vue.set(this, 'buffer', account)
        account.getPublicKey()
        this.login()
      } catch (e) {
        switch (e.message) {
          case 'Private Key encrypted!':
            this.loginPasswordNeeded = true
            this.loginError = 'Password is needed for this keystore.'
            break
          default:
            this.loginError = 'Keystore error. Please re-select a correct keystore file'
        }
      }
    },

    openKeystore (e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = res => this.checkKeystore(res.target.result)
      reader.readAsText(file, 'UTF-8')
    },

    login () {
      if (this.loginPasswordNeeded) {
        try {
          const password = this.loginPassword
          this.loginPassword = ''
          const decrypted = this.buffer.decrypt(password)
          this.loginError = null
          this.loggedIn(decrypted)
        } catch (e) {
          switch (e.message) {
            case 'Wrong Password!':
              this.loginError = 'The entered password is invalid for this keystore file.'
              break
            default:
              this.loginError = 'Decrypt error. Please re-check your input.'
          }
        }
      } else {
        this.loggedIn(this.buffer)
      }
    },

    logout () {
      this.buffer = null
      this.loginPassword = false
      this.loginPasswordNeeded = false
      this.newKeystoreShowPassword = false
      this.newKeystorePassword = ''
      this.loggedOut()
    },

    generateKeystore () {
      const password = this.newKeystorePassword
      this.newKeystorePassword = ''
      const keystore = this.account.encrypt(password)
      const encrypted = keystore.encrypted
      const a = document.createElement('a')
      a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(encrypted))
      a.setAttribute('download', 'keystore.' + keystore.address + '.txt')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },

    generateKey () {
      const a = new wallet.Account()
      const w = {
        type: 'Normal',
        address: a.address,
        privateKey: a.privateKey,
        publicKey: a.publicKey
      }
      if (this.createPassword.length > 0) {
        w.nep2 = wallet.encrypt(wallet.private, this.createPassword)
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
  },

  mounted () {
    if (this.isLogged) this.tab = 'login'
  }
}
</script>
