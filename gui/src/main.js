// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueTimeago from 'vue-timeago'
import App from './App'

import router from './router'
import store from './store'
import 'vue-awesome/icons'

import Icon from 'vue-awesome/components/Icon'
import VueQr from 'vue-qr'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Window from './components/Window'
import Debug from '@/components/Debug'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})

Vue.component('window', Window)
Vue.component('scroller', VuePerfectScrollbar)
Vue.component('icon', Icon)
Vue.component('qr', VueQr)
Vue.component('debug', Debug)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
