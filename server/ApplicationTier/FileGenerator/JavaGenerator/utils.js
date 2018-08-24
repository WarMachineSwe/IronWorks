/**
 * Creates JAVA attribute name from raw name
 * @param raw attribute name
 * @returns {string} JAVA attribute name
 */
function getJavaAttributeName (raw) {
  return raw.charAt(0).toUpperCase() + raw.slice(1) // first char upper case
}

/**
 * Adds indentation
 * @param indentationLevel {int} level of indentation of method
 */
function addIndentation (indentationLevel) {
  var indentation = ''
  for (var i = 0; i < indentationLevel; i++) {
    indentation += '\t'
  }
  return indentation
}

module.exports = {
  'getJavaAttributeName': getJavaAttributeName,
  'addIndentation': addIndentation
}
