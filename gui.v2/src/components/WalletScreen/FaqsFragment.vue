<template lang="pug">
  .roll(data-aos="fade-up")
    .card
      .caption Miskre Wallet
      .content
        faqs(:faqs="faqs")
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
          q: 'What is Miskre Explorer Wallet?',
          a: 'Miskre Explorer Wallet is a full wallet that lets Miskre token holder interact with the Miskre blockchain. Token holders do not need to create any online account or pay any fee to use Miskre Explorer Wallet. No data leaves user\'s browser. Miskre make it easy for everyone to create, save, add access his/her information and interact with the Miskre blockchain network.'
        },
        {
          q: 'How does Miskre Explorer Wallet work?',
          a: 'Miskre Explorer Wallet helps token holder does not require syncing locally with the Miskre blockchain and instead, uses a Miskre remote server, which is Miskre main blockchain explorer, to fetch data like the transaction history or the amount of KRE available to claim. Note that <b>none</b> of your personal data is ever sent to Miskre Explorer Wallet. Specifically, you private key and encrypted keystore files never leave your local browser.'
        },
        {
          q: 'How secure is it?',
          a: 'Miskre Explorer Wallet never sends your private keys or encrypted keystore files across the network. They are stored locally on your computer. Private keys are only ever stored in the current session\'s memory and are cleared between sessions. If an attacker were to gain access to your browser, they would additionally need the password to unlock your encrypted keystore file in order to gain access to your private keys and thus your balance.'
        },
        {
          q: 'How can I trust Miskre Explorer Wallet?',
          a: 'Miskre Explorer Wallet app source code is available on Github for you to verify. Miskre serve the wallet over SSL (https) which eliminates the possibility of tampering with the Javascript code between our server and your browser. Still not sure? Download the latest standalone release on our Github release page and open it using your browser. Alternatively, you can build directly from the sourcecode.'
        },
        {
          q: 'What if I forget my encrypted keystore file\'s password or lose my private key?',
          a: 'Miskre Explorer Wallet does not hold your keys for you. Miskre cannot access account, recover keys, reset passwords, nor reverse transactions. Protect your kets and alway doublecheck that you are on the correct URL. You are responsible for your security.'
        },
        {
          q: 'We are not responsible for any lost.',
          a: 'Miskre Explorer Wallet and some of underlying Javascript libraries Miskre use are under active development. While we have throughly tested, there is always the possibility something unexpected happens that causes your funds to be lost. Please do not invest more than you are willing to lose, and please be careful.'
        }
      ]
    }
  }
}
</script>
