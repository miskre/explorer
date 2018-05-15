<template lang="pug">
  .loading
    .text
      .progress
        img.mis(src="@/assets/mis.svg")
        img.kre(src="@/assets/kre.svg")
      span(v-text="text")
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: 'Loading'
    }
  }
}
</script>
