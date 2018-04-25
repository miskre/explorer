// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueTimeago from 'vue-timeago'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import App from './App'
import router from './router'

Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})

Vue.config.productionTip = false
Vue.component('scroller', VuePerfectScrollbar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
