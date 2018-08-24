const SQL_DRIVER_PACKAGE = '<SqlConnectionPackage>' // to be filled when zipping files
const DEFAULT_PACKAGE = 'org.warmachine.ironworks.generated'

/**
 * Finds smallest string among all strings in list
 * @param lst {[]} list of string
 * @returns {string} smallest string
 */
function smallestString (lst) {
  if (lst.length === 0) {
    return null
  }

  var smallest = lst[0]
  lst.forEach(function (str) {
    if (str.length < smallest.length) {
      smallest = str
    }
  })

  return smallest
}

/**
 * Checks if char at position is the same among all strings in list
 * @param char {string} char to check
 * @param position {int} position to check
 * @param lst {[]} list of string
 * @returns {boolean} true iff char is the same
 */
function isTheSameForAll (char, position, lst) {
  if (char === null) {
    return false
  }

  for (var i = 0; i < lst.length; i++) {
    var str = lst[i]
    var isTheSame = (str[position] === char)
    if (!isTheSame) {
      return false
    }
  }

  return true
}

/**
 * Searches longest common substring starting at index 0 among all strings in list
 * @param lst {[]} list of string
 * @returns {string} longest common substring
 */
function firstLongestCommonSubstring (lst) {
  var smallest = smallestString(lst)
  var end
  var keepSearching = true

  if (smallest === null) {
    return null
  }

  for (end = 0; end < smallest.length && keepSearching; end++) {
    if (!isTheSameForAll(smallest[end], end, lst)) {
      keepSearching = false
      end -= 1
    }
  }

  return smallest.substr(0, end)
}

/**
 * Finds suitable location to all packages
 * @param packages {[]} list of Java packages
 * @returns {string} package common to all other packages
 */
function getCommonPackage (packages) {
  var common = firstLongestCommonSubstring(packages)
  var isOK = common !== null && common.length > 0
  if (!isOK) {
    common = DEFAULT_PACKAGE
  }

  if (common.endsWith('.')) {
    common = common.substr(0, common.length - 1)
  }

  return common
}

module.exports = {
  'SQL_DRIVER_PACKAGE': SQL_DRIVER_PACKAGE,
  'DEFAULT_PACKAGE': DEFAULT_PACKAGE,
  'smallestString': smallestString,
  'isTheSameForAll': isTheSameForAll,
  'firstLongestCommonSubstring': firstLongestCommonSubstring,
  'getCommonPackage': getCommonPackage
}
