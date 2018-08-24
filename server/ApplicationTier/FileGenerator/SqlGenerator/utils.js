var utils = require('../../../utils/misc')

/**
 * Creates SQL attribute name from raw name
 * @param raw attribute name
 * @returns {string} SQL attribute name
 */
function getSqlAttributeName (raw) {
  var out = raw.toUpperCase()
  out = utils.replaceAll(out, '  ', ' ')
  out = utils.replaceAll(out, ' ', '_')
  return out
}

/**
 * Creates SQL table name from raw name
 * @param raw attribute name
 * @returns {string} SQL table name
 */
function getSqlTableName (raw) {
  return getSqlAttributeName(raw)
}

module.exports = {
  'getSqlAttributeName': getSqlAttributeName,
  'getSqlTableName': getSqlTableName
}
