<template lang="pug">
  #app
    transition(name="fade")
      #menu(v-if="menuDisplayed" @click="toggleMenu")
        ul.navigations
          li
            a(target="_blank" href="https://home.miskre.org") home
          li
            router-link(:to="{name: 'Explorer'}") explorer
          li
            router-link(:to="{name: 'Wallet'}") wallet
    #top-bar
      a.menu(href="#" data-aos="fade-right" data-aos-duration="1000" @click.stop.prevent="toggleMenu")
        img(src="@/assets/menu.svg")
      router-link.logo(:to="{name: 'Explorer'}" data-aos="fade-down" data-aos-duration="1000")
        img(src="@/assets/logo.svg")
      block primary
    #social-bar(data-aos="fade-right" data-aos-duration="1000")
      a(target="_blank" :href="links.twitter" v-if="links.twitter")
        img(src="@/assets/twitter.svg")
      a(target="_blank" :href="links.facebook" v-if="links.facebook")
        img(src="@/assets/facebook.svg")
      a(target="_blank" :href="links.medium" v-if="links.medium")
        img(src="@/assets/medium.svg")
      a(target="_blank" :href="links.reddit" v-if="links.reddit")
        img(src="@/assets/reddit.svg")
      a(target="_blank" :href="links.telegram" v-if="links.telegram")
        img(src="@/assets/telegram.svg")
      a(target="_blank" :href="links.slack" v-if="links.slack")
        img(src="@/assets/slack.svg")
    #preload(v-if="!loaded")
      .text
        .progress
          img.mis(src="@/assets/mis.svg")
          img.kre(src="@/assets/kre.svg")
        span(v-if="language === 'ru'") Привет_мир
        span(v-else-if="language === 'es'") hola_mundo
        span(v-else-if="language === 'zh'") 你好，世界
        span(v-else-if="language === 'ja'") こんにちは世界
        span(v-else-if="language === 'ko'") 안녕_세상
        span(v-else-if="language === 'de'") hallo_welt
        span(v-else) hello_world
    modals-container
    v-dialog
    router-view
</template>

<script>
import aos from 'aos'
import 'aos/dist/aos.css'

export default {
  name: 'App',

  metaInfo: {
    title: 'explorer',
    titleTemplate: 'miskre - %s'
  },

  data () {
    return {
      menuDisplayed: false,
      loaded: false,
      language: 'en',
      supported: {
        en: 'English',
        de: 'German',
        zh: 'Chinese',
        ja: 'Japanese',
        ko: 'Korean',
        es: 'Spanish',
        ru: 'Russian'
      },
      links: {
        appstore: '#',
        googleplay: '#',
        facebook: null,
        instagram: null,
        reddit: 'https://www.reddit.com/r/miskre/',
        twitter: 'https://twitter.com/Miskre_Global',
        medium: 'https://medium.com/miskre',
        slack: 'https://chat.miskre.org',
        telegram: 'https://t.me/miskre'
      }
    }
  },

  methods: {
    toggleMenu () {
      this.menuDisplayed = !this.menuDisplayed
    }
  },

  mounted () {
    this.loaded = true
    aos.init()
  }
}
</script>

<style lang="stylus" src="./assets/index.styl" />
