<template lang="pug">
  ul.faqs(v-if="faqs")
    li(v-for="faq in faqs" :class="{collapsed: faq.collapsed}")
      .question(v-html="faq.q" @click.prevent="faq.collapsed = !faq.collapsed")
      .answer(v-html="faq.a")
</template>

<script>
import {map, clone} from 'underscore'
export default {
  name: 'Faqs',
  props: {
    data: Array
  },

  data () {
    return {
      faqs: map(this.data, f => {
        const faq = clone(f)
        faq.collapsed = true
        return faq
      })
    }
  }
}
</script>
