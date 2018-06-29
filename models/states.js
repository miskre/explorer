import mongoose from 'mongoose'
const {Mixed} = mongoose.SchemaTypes

export default new mongoose.Schema({
  _id: {
    type: String,
    index: true
  },
  value: Mixed,
  lastUpdated: Number
}, {
  versionKey: false
})