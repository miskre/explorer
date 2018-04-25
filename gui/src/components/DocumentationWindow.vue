<template lang="pug">
  window.documentation(:hook="hook" width="700px")
    .big(slot="title")
      em docs
      img.logo(src="../assets/logo.svg")
    div(slot="content")
      scroller.info-panel
        ul.info-bar
          li
            .name Status
            .value Pre-release
          li
            .name Articles
            .value 18
          li
            .name Contributors
            .value 6
      .padding.pv-30
        p.m-0 Coming at&nbsp;
            strong June 1st, 2018
</template>

<script>
export default {
  name: 'DocumentationWindow',
  props: {
    hook: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>
