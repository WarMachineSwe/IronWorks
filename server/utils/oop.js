/**
 * Inheritance helper
 * @param proto class
 * @returns {F} subclass
 */
function inherit (proto) {
  var F = function () {
  }
  F.prototype = proto
  return new F()
}

module.exports = {
  'inherit': inherit
}
