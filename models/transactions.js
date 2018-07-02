import mongoose from 'mongoose'
const {Mixed} = mongoose.SchemaTypes

export default new mongoose.Schema({
  _id: {
    type: String,
    index: true
  },
  txid: String,
  size: Number,
  type: {
    type: String,
    index: true,
  },
  version: Number,
  attributes: Mixed,
  vin: Mixed,
  vout: Mixed,
  sys_fee: String,
  net_fee: String,
  scripts: Mixed,
  nonce: Number,
  blockhash: String,
  block_index: Number,
  confirmations: Number,
  blocktime: {
    type: Number,
    index: true
  },
  claims_keys_v1: Mixed,
  vin_verbose: Mixed,
  claims_verbose: Mixed,
}, {
  versionKey: false
})
