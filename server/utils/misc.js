var dates = require('./dates')

/**
 * Converts raw value to title case
 * @param str {string} string
 * @returns {string} title-cased string
 */
function toTitleCase (str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }
  )
}

/**
 * Replace all occurrences of a string with a new string
 * @param str {string} string
 * @param toReplace {string} words to replace
 * @param replacement {string} new value
 * @returns {string} original string with everything replaced
 */
function replaceAll (str, toReplace, replacement) {
  return str.split(toReplace).join(replacement)
}

/**
 * Creates a meaningful debug message with date and time
 * @param tag {string} tag name
 * @return {string} message
 */
function getDebugMessage (tag) {
  var unixTimeNow = Date.now() / 1000.0
  var timeNow = new dates.UnixDateTime(unixTimeNow).toString()
  var out = timeNow + ' '
  out += tag.toUpperCase()
  return out
}

/**
 * Prints meaningful data about error
 * @param tag {string} actor
 * @param message {string} message to print
 */
function debug (tag, message) {
  console.log(getDebugMessage(tag))
  console.log(message)
}

module.exports = {
  'replaceAll': replaceAll,
  'toTitleCase': toTitleCase,
  'debug': debug
}
