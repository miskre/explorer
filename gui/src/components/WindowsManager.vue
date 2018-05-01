<template lang="pug">
  #windows-manager
    template(v-for="w, k in windows" v-if="!w.destroyed")
      ExplorerWindow(v-if="w.type === 'Explorer'" v-bind="params(w)")
      DocumentationWindow(v-else-if="w.type === 'Documentation'" v-bind="params(w)")
      GuideWindow(v-else-if="w.type === 'Guide'" v-bind="params(w)")
      BlockWindow(v-else-if="w.type === 'Block'" v-bind="params(w)")
      TransactionWindow(v-else-if="w.type === 'Transaction'" v-bind="params(w)")
      WalletWindow(v-else-if="w.type === 'Wallet'" v-bind="params(w)")
      PaperWalletWindow(v-else-if="w.type === 'PaperWallet'" v-bind="params(w)")

</template>

<script>
import {mapActions} from 'vuex'
import ExplorerWindow from './ExplorerWindow'
import DocumentationWindow from './DocumentationWindow'
import GuideWindow from './GuideWindow'
import BlockWindow from './BlockWindow'
import TransactionWindow from './TransactionWindow'
import WalletWindow from './WalletWindow'
import PaperWalletWindow from './PaperWalletWindow'

export default {
  name: 'WindowsManager',
  components: {
    ExplorerWindow,
    GuideWindow,
    DocumentationWindow,
    BlockWindow,
    TransactionWindow,
    WalletWindow,
    PaperWalletWindow
  },
  props: {
    windows: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  methods: {
    ...mapActions({
      pushWindow: 'ui/pushWindow'
    }),
    params (win) {
      return {
        hook: win.id,
        ...win.params
      }
    }
  },
  mounted () {
    // this.pushWindow({id: 'explorer', type: 'Explorer', params: {}})
    this.pushWindow({id: 'wallet', type: 'Wallet', params: {}})
  }
}
</script>
