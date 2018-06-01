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
import Vmodal from 'vue-js-modal'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VeeValidate from 'vee-validate'
import Debug from '@/components/Debug'

import CripLoading from 'crip-vue-loading'
import api from '@/common/api'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VeeValidate)
Vue.use(Vmodal, {
  componentName: 'modal',
  dynamic: true,
  dialog: true
})
Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})

Vue.use(CripLoading, {
  axios: api,
  applyOnRouter: true
})

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
