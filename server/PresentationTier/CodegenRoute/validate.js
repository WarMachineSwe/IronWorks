/**
 * Validates a entity
 * @param entity raw client request
 * @param regex {RegExp} regex
 * @param reserved_words {[]} list of words not allowed
 */
function Validator (entity, regex, reserved_words) {
  this.words = reserved_words
  this.raw = entity
  var self = this

  /**
   * Checks if entity names are valid
   * @return {boolean} true iff all entity content is valid
   */
  this.isValid = function () {
    var hasAtLeastOnePrimaryKey = false
    var toValidate = []
    toValidate.push(entity['entityName'])

    var attrs = entity['dataFields']
    attrs.forEach(function (attr) {
      toValidate.push(attr['fieldName'])
      if (attr['primaryK']) {
        hasAtLeastOnePrimaryKey = true
      }
    })  // gets all attributes

    for (var i = 0; i < toValidate.length; i++) {
      var toTest = toValidate[i].toLowerCase()
      if (!regex.test(toTest)) {
        return false
      }

      if (self.words.includes(toTest)) {
        return false
      }
    }
    return hasAtLeastOnePrimaryKey
  }
}

module.exports = {
  'Validator': Validator
}
