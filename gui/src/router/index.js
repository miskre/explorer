import Vue from 'vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'
import ExplorerScreen from '@/components/ExplorerScreen'
import BlockScreen from '@/components/BlockScreen'
import TransactionScreen from '@/components/TransactionScreen'
import AddressScreen from '@/components/AddressScreen'

import WalletScreen from '@/components/WalletScreen'
import WalletImportFragment from '@/components/WalletScreen/ImportFragment'
import WalletCreateFragment from '@/components/WalletScreen/CreateFragment'
import WalletFaqsFragment from '@/components/WalletScreen/FaqsFragment'

Vue.use(Router)
Vue.use(VueMeta)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Explorer',
      component: ExplorerScreen
    },
    {
      path: '/block/:_id',
      name: 'Block',
      component: BlockScreen
    },
    {
      path: '/transaction/:_id',
      name: 'Transaction',
      component: TransactionScreen
    },
    {
      path: '/addresses/:_id',
      name: 'Address',
      component: AddressScreen
    },
    {
      path: '/wallet',
      component: WalletScreen,
      children: [
        {
          path: 'import',
          name: 'WalletImport',
          component: WalletImportFragment
        },
        {
          path: 'create',
          name: 'WalletCreate',
          component: WalletCreateFragment
        },
        {
          path: 'faqs',
          name: 'WalletFaqs',
          component: WalletFaqsFragment
        },
        {
          path: '',
          name: 'Wallet',
          redirect: {
            name: 'WalletImport'
          }
        }
      ]
    }
  ]
})
