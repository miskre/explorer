<template lang="pug">
  .overlay
    .window(:style="{width, left, top}" ref="window")
      span.x(v-if="closeable") &times;
      scrollbar
        .title(@mousedown="dragStart")
          slot(name="title")
        .content
          slot(name="content")
</template>

<script>
export default {
  name: 'Window',
  props: {
    logo: {
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '1000px'
    }
  },
  data () {
    return {
      top: null,
      left: null,
      lastTop: 0,
      lastLeft: 0,
      moved: false
    }
  },
  methods: {
    dragStart (e) {
      e.preventDefault()
      this.lastLeft = e.clientX
      this.lastTop = e.clientY
      this.moved = true
      document.onmouseup = this.drop
      document.onmousemove = this.drag
    },
    drag (e) {
      const deltaLeft = this.lastLeft - e.clientX
      const deltaTop = this.lastTop - e.clientY
      this.lastLeft = e.clientX
      this.lastTop = e.clientY
      this.left = this.$refs.window.offsetLeft - deltaLeft + 'px'
      this.top = this.$refs.window.offsetTop - deltaTop + 'px'
    },
    drop (e) {
      document.onmouseup = null
      document.onmousemove = null
    },
    position () {
      if (!this.moved) {
        this.top = (window.innerHeight - this.$refs.window.offsetHeight) / 2.5 + 'px'
        this.left = (window.innerWidth - this.$refs.window.offsetWidth) / 2 + 'px'
      }
    }
  },
  updated () {
    this.position()
  }
}
</script>
