<template lang="pug">
  #desktop
    ul.icons
      li(v-for="i, k in icons" :key="k")
        .frame(@dblclick.prevent="open(i)")
          img.icon(:src="i.icon")
          .label(v-text="i.label")

</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'Desktop',
  props: {
    icons: {
      required: true
    }
  },
  methods: {
    ...mapActions({
      pushWindow: 'ui/pushWindow'
    }),
    open (cmd) {
      switch (cmd.type) {
        case 'Link':
          return window.open(cmd.link, '_blank')
        case 'Whitelist':
          return window.open('https://whitelist.miskre.org', '_blank')
        case 'Explorer':
        case 'Documentation':
        case 'Guide':
          return this.pushWindow({...cmd, destroyed: false})
      }
    }
  }
}
</script>
