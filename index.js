import express from 'express'
import history from 'connect-history-api-fallback'
import bodyParser from 'body-parser'
import cors from 'cors'
import explorer from './explorer'
import sync from './sync'

const port = process.env.PORT || 3000
const app = express()

app.set('view engine', 'pug')
app.set('views', './views')
app.use(history({
  index: '/index.html'
}))
app.use('/assets', express.static('./assets'))
app.use('/', express.static('./gui.v2/dist'))
app.use(bodyParser.json())
app.use(cors())

app.use(function(req, res, next) {
  res.locals = {
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
      home: function(lang = res.locals.language) {
        return '/' + lang + '/'
      },
      whitepaper: function(lang = res.locals.language) {
        return '/' + lang + '/whitepaper'
      },
      whitelist: function(lang = res.locals.language) {
        return 'https://whitelist.miskre.org' + '/' + lang
      },
      crowdsale: function(lang = res.locals.language) {
        return 'https://crowdsale.miskre.org' + '/' + lang
      },
      pdf: function(lang = res.locals.language) {
        return '/docs/whitepaper.' + lang + '.pdf'
      },
      appstore: '#',
      googleplay: '#',
      medium: 'https://medium.com/miskre',
      slack: 'https://miskre.slack.com',
      telegram: 'https://t.me/miskre'
    },
    __l: function(name, args) {
      switch (typeof res.locals.links[name]) {
        case 'function': return res.locals.links[name](args)
        case 'string':
        default: return res.locals.links[name]
      }
    },
    __h: function(s) {
      return s.substr(0, 12) + '...' + s.substr(-12)
    }
  }
  next()
  // setTimeout(next, 2000)
})

function switcher(req, res, next) {
  switch (req.params.lang) {
    case 'zh':
    case 'en':
    case 'es':
    case 'ja':
    case 'ko':
    case 'ru':
    case 'de':
      res.locals.language = req.params.lang
      break
    default:
      res.locals.language = 'en'
  }
  next()
}

app.use('/api', switcher, explorer)
app.use('/sync', sync)

app.listen(port)
