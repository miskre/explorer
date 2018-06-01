<template lang="pug">
  ul.faqs(v-if="faqs")
    li(v-for="faq in faqs")
      .question(v-html="faq.q")
      .answer(v-html="faq.a")
</template>

<script>
export default {
  name: 'Faqs',
  props: {
    faqs: Array
  }
}
</script>
