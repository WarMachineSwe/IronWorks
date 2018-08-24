/**
 * Checks if number is a integer
 * @param n {number} candidate
 * @return {boolean} true iff is a integer
 */
function isInt (n) {
  return n % 1 === 0
}

module.exports = {
  'isInt': isInt
}
