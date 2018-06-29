import mongoose from 'mongoose'
import Transaction from './transactions'
const {Mixed} = mongoose.SchemaTypes

export default new mongoose.Schema({
  _id: {
    type: String,
    index: true
  },
  hash: String,
  size: Number,
  version: Number,
  previousblockhash: String,
  merkleroot: String,
  time: {
    type: Number,
    index: true
  },
  index: {
    type: Number,
    index: true
  },
  nonce: String,
  nextconsensus: String,
  script: Mixed,
  tx: [Transaction],
  confirmations: {
    type: Number,
    index: true
  },
  nextblockhash: String
}, {
  versionKey: false
})