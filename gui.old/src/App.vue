<template lang="pug">
  #app
    Desktop(:icons="icons")
    WindowsManager(:windows="windows")
    // router-view
</template>

<script>
import WindowsManager from './components/WindowsManager'
import Desktop from './components/Desktop'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    WindowsManager,
    Desktop
  },
  data () {
    return {
      icons: {
        explorer: {
          icon: require('./assets/icon.explorer.svg'),
          label: 'explorer',
          id: 'explorer',
          type: 'Explorer',
          params: {}
        },
        homepage: {
          icon: require('./assets/icon.homepage.svg'),
          label: 'homepage',
          type: 'Link',
          link: 'https://home.miskre.org'
        },
        whitelist: {
          icon: require('./assets/icon.whitelist.svg'),
          label: 'whitelist',
          type: 'Link',
          link: 'https://whitelist.miskre.org'
        },
        documentation: {
          icon: require('./assets/icon.documentation.svg'),
          id: 'documentation',
          label: 'documentation',
          type: 'Documentation',
          params: {}
        },
        guide: {
          icon: require('./assets/icon.guide.svg'),
          id: 'guide',
          label: 'guide',
          type: 'Guide',
          params: {}
        },
        wallet: {
          icon: require('./assets/icon.package.svg'),
          id: 'wallet',
          label: 'wallet',
          type: 'Wallet',
          params: {}
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      windows: 'ui/windows'
    })
  }
}
</script>

<style lang="stylus" src="./assets/explorer.styl" />
