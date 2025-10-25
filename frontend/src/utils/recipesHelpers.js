export function getArrayFromString(string, symbol) {
  return string.split(symbol).map(item => item.trim())
}

export function getReplacedArrayFromString(string, symbol, from, to) {
  return string.split(symbol).map(item => item.trim().replace(from, to)).filter(ing => ing.length)
}