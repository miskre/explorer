import express from 'express'
import explorer from './explorer'

const app = express()
app.set('view engine', 'pug')
app.set('views', './views')
app.use('/', explorer)

app.listen(3000)