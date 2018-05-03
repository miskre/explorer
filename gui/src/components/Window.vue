<template lang="pug">
  .overlay(:style="{'z-index': z(hook)}")
    .window(:style="{width, left, top, opacity}" ref="window" @mousedown="focus")
      span.x(v-if="closeable" @click.prevent="destroy(hook)") &times;
      scroller
        .title(@mousedown="dragStart")
          slot(name="title")
        .content
          slot(name="content")
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

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
    },
    hook: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      opacity: 0,
      top: null,
      left: null,
      lastTop: 0,
      lastLeft: 0,
      moved: false
    }
  },
  computed: {
    ...mapGetters({
      z: 'ui/z'
    })
  },
  methods: {
    ...mapActions({
      focusWindow: 'ui/focusWindow',
      destroyWindow: 'ui/destroyWindow'
    }),
    focus (e) {
      this.focusWindow(this.hook)
    },
    destroy (e) {
      this.destroyWindow(this.hook)
    },
    dragStart (e) {
      if (e.which > 1) return
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
      if (!this.moved && this.$refs.window) {
        this.top = '10vh'
        this.left = (window.innerWidth - this.$refs.window.offsetWidth) / 2 + 'px'
      }
    }
  },
  mounted () {
    this.opacity = 1
  },
  updated () {
    this.position()
    this.opacity = 1
  }
}
</script>
