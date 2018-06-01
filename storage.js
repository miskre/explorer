import nedb from 'nedb'

export const State = new nedb({
  filename: './chains/state',
  autoload: true
})

export const Block = new nedb({
  filename: './chains/blocks',
  autoload: true
})

export const Address = new nedb({
  filename: './chains/addresses',
  autoload: true
})

export const Transaction = new nedb({
  filename: './chains/transactions',
  autoload: true
})

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
