var utils = require('./utils')
var models = require('./models')

/**
 * Converts raw value to SQL-syntax compatible one
 * @param raw {string} Raw value
 * @returns {string} || {null} string iff valid input
 */
function SqlType (raw) {
  this.raw = raw.toLowerCase()
  this.parsed = null

  /**
   * Parses raw type
   */
  this.parse = function () {
    var keys = Object.keys(models.SQL_TYPE)
    for (var i = 0; i < keys.length; i++) {
      var type = models.SQL_TYPE[keys[i]]
      if (type.name === this.raw) {
        this.parsed = type
      }
    }

    if (this.parsed === null) {
      this.parsed = models.SQL_TYPE.ERROR
    }
  }

  /**
   * Converts obj to string representation
   * @returns {string} Type of an attribute
   */
  this.toString = function () {
    this.parse()
    return this.parsed.value
  }
}

/**
 * Model for SQL attribute of table
 * @param type {string} Type of attribute
 * @param isPrimary {boolean} true iff attribute is primary key
 * @param name {string} Name of attribute
 * @param notNull {boolean} iff attribute is NOT NULL
 */
function SqlAttribute (type, isPrimary, name, notNull) {
  this.type = new SqlType(type)
  this.isPrimary = isPrimary
  this.name = utils.getSqlAttributeName(name)
  this.notNull = notNull

  /**
   * Converts object to string representation
   * @returns {string} SQL-like syntax for this object
   */
  this.toString = function () {
    var out = this.name + ': '
    out += this.type

    if (this.isPrimary) {
      out += ' PRIMARY KEY'
    }

    if (this.notNull) {
      out += ' NOT NULL'
    }

    return out
  }
}

module.exports = {
  'Type': SqlType,
  'Attribute': SqlAttribute
}
