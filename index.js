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
app.use('/assets', express.static('./assets'))
app.use(bodyParser.json())
app.use(cors())
app.use('/api', explorer)
app.use('/sync', sync)
app.use(history({
  index: '/index.html'
}))
app.use('/', express.static('./gui/dist'))

app.listen(port)
