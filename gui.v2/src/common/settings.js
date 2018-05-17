const development = {
  rpcRoot: 'http://192.168.1.200:10332',
  apiRoot: 'http://localhost:3000/api'
}

const production = {
  rpcRoot: 'https://explorer.miskre.org/rpc',
  apiRoot: 'https://explorer.miskre.org/api'
}

export function env () {
  switch (process.env.NODE_ENV) {
    case 'production': return production
    default: return development
  }
}
