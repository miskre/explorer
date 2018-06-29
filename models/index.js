import mongoose from 'mongoose'
import StateSchema from './states'
import BlockSchema from './blocks'
import TransactionSchema from './transactions'

mongoose.connect('mongodb://localhost/explorer', {
  autoIndex: false
})

export const State = mongoose.model('State', StateSchema)
export const Block = mongoose.model('Block', BlockSchema)
export const Transaction = mongoose.model('Transaction', TransactionSchema)

export function deleteState(name) {
  return new Promise((resolve, reject) => {
    State.remove({ _id: name }, {}, (e, res) => {
      if (e) reject(e)
      else resolve(res)
    })
  })
}

export function setState(name, value) {
  return new Promise((resolve, reject) => {
    State.update({
      _id: name
    }, {
      _id: name,
      lastUpdated: Date.now(),
      value
    }, { upsert: true }, (e, res) => {
      if (e) reject(e)
      else resolve(res)
    })
  })
}

export function getState(name, value) {
  return new Promise((resolve, reject) => {
    State.findOne({ _id: name }, async (e, doc) => {
      if (e) return reject(e)
      if (doc && typeof doc.value !== 'undefined') return resolve(doc.value)
      if (typeof value !== 'undefined') {
        await setState(name, value)
        return resolve(value)
      }
      return resolve(undefined)
    })
  })
}