import Vue from 'vue'
import Router from 'vue-router'
import ExplorerWindow from '@/components/ExplorerWindow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ExplorerWindow',
      component: ExplorerWindow
    }
  ]
})
