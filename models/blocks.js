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
  time: Number,
  index: Number,
  nonce: String,
  nextconsensus: String,
  script: Mixed,
  tx: [Transaction],
  confirmations: Number,
  nextblockhash: String
}, {
  versionKey: false
})