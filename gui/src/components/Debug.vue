<template lang="pug">
  pre.debug(v-if="typeof value !== 'undefined'")
    code(v-if="typeof value === 'object'" v-text="JSON.stringify(value, null, 2)")
    code(v-else v-text="value")
</template>

<script>
export default {
  name: 'Debug',

  props: {
    value: {
      required: true
    }
  }
}
</script>
