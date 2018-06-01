const development = {
  apiRoot: 'http://localhost:3000/api'
}

const production = {
  apiRoot: 'https://explorer.miskre.org/api'
}

export function env () {
  switch (process.env.NODE_ENV) {
    case 'production': return production
    default: return development
  }
}
