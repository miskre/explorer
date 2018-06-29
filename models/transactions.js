import mongoose from 'mongoose'
const {Mixed} = mongoose.SchemaTypes

export default new mongoose.Schema({
  _id: {
    type: String,
    index: true
  },
  txid: String,
  size: Number,
  type: String,
  version: Number,
  attributes: Mixed,
  vin: Mixed,
  vout: Mixed,
  sys_fee: String,
  net_fee: String,
  scripts: Mixed,
  nonce: Number,
  blockhash: String,
  confirmations: Number,
  blocktime: Number,
  claims_keys_v1: Mixed,
  vin_verbose: Mixed,
  claims_verbose: Mixed,
}, {
  versionKey: false
})