<template lang="pug">
  pre.debug
    code {{ JSON.stringify(value, null, 2) }}
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
