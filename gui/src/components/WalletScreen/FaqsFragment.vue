<template lang="pug">
  .roll(data-aos="fade-up")
    .card
      .caption Miskre Wallet
      .content
        faqs(:data="faqs")
</template>

<script>
import Faqs from '@/components/Faqs'

export default {
  name: 'WalletFaqsFragment',

  metaInfo: {
    title: 'wallet'
  },

  components: {
    Faqs
  },

  data () {
    return {
      faqs: [
        {
          q: 'What is the Miskre Wallet?',
          a: 'Miskre Wallet is a full features wallet that let Miskre token holders access to the Miskre Blockchain. Miskre Wallet let users interact with the Miskre blockchain, users do not need to create an account or pay any fees to use the Miskre Wallet.'
        },
        {
          q: 'Is it secure?',
          a: 'Security is our main priority, Miskre Wallet never sends your private key or keystore file across the network, they are stored locally on your computer. Private keys are stored in the current session’s memory and are cleared between every session.'
        },
        {
          q: 'What if I forgot my encrypted keystore file\'s password or lose my private key?',
          a: 'Miskre cannot access accounts, recover keys, reset passwords, or reverse transactions. You are responsible for your own security and you should take every precaution to ensure the safety of your funds.'
        }
      ]
    }
  }
}
</script>
