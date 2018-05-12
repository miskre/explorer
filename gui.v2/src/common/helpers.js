import numeral from 'numeral'

export const TRUNCATE_SIZE = 15

export function __h (s) {
  if (typeof s === 'undefined') return ''
  return `${s.substr(0, TRUNCATE_SIZE)}...${s.substr(TRUNCATE_SIZE * -1)}`
}

export function __n (n, format = '0,0') {
  if (typeof n === 'undefined') return ''
  return numeral(n).format(format)
}
