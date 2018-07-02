<template lang="pug">
  .wallet-generate-keystore
    form#new-keystore(@submit.stop.prevent="generate")
      label Password &mdash; Required
        input(:type="showPassword ? 'text' : 'password'" v-model="password" required)
      .rw
        .cl.sm-6.tl
          label.mb-5(for="show-password") Show password
        .cl.sm-6.tr
          .sw.ib.mb-0.rd
            input#show-password(type="checkbox" v-model="showPassword")
            label(for="show-password")
      .memo Generate new keystore will take a while with ecryption mode on.
      button.bt.a.mb-0(type="submit") Download
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'WalletGenerateKeystore',

  data () {
    return {
      password: '',
      showPassword: false
    }
  },

  computed: {
    ...mapGetters({
      account: 'users/account'
    })
  },

  methods: {

    clear () {
      this.password = ''
      this.showPassword = false
    },

    generate () {
      const password = this.password
      this.clear()
      const keystore = this.account.encrypt(password)
      const encrypted = keystore.encrypted
      const a = document.createElement('a')
      a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(encrypted))
      a.setAttribute('download', 'keystore.' + keystore.address + '.txt')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

}
</script>
