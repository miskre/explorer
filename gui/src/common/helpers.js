export const TRUNCATE_SIZE = 15

export function __h (s) {
  return `${s.substr(0, TRUNCATE_SIZE)}...${s.substr(TRUNCATE_SIZE * -1)}`
}
