export const TRUNCATE_SIZE = 15

export function __h (s) {
  if (typeof s === 'undefined') return ''
  return `${s.substr(0, TRUNCATE_SIZE)}...${s.substr(TRUNCATE_SIZE * -1)}`
}
