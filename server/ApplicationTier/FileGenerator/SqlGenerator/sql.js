var errors = require('../../Exceptions/exception')
var elements = require('./elements')
var utils = require('./utils')

/**
 * Creates string representation of class with attributes
 * @param tableName {string} name of class to create
 * @param attributes {SqlAttribute[]} List of attributes of table
 */
function SqlTable (tableName, attributes) {
  this.className = utils.getSqlTableName(tableName)
  this.attrs = attributes

  /**
   * Converts object to string representation
   * @returns {string} SQL-like syntax for this object
   */
  this.toString = function () {
    var out = 'CREATE TABLE ' + this.className + ' ('
    var lines = []
    this.attrs.forEach(function (attr) {
      lines.push(attr.toString())
    })

    out += '\n\t' + lines.join(',\n\t')
    out += '\n)'
    return out
  }
}

/**
 * Parses raw data to get SQL TABLE
 * @param rawEntity raw JSON input
 */
function EntityParser (rawEntity) {
  this.raw = rawEntity

  /**
   * Parses table name from raw data
   * @returns {string} table name
   */
  this.getName = function () {
    try {
      return utils.getSqlTableName(this.raw['entityName'])
    } catch (error) {
      throw new errors.ServerError(
        errors.ERROR_TYPE.SQL_GENERATOR,
        errors.ERROR_LEVEL.HIGH,
        error.toString()
      )
    }
  }

  /**
   * Parses SQL table from raw data
   * @returns {SqlTable} SQL table with raw attributes
   */
  this.getData = function () {
    try {
      var attr = []
      this.raw.dataFields.forEach(function (df) {
        attr.push(
          new elements.Attribute(
            df['fieldType'],
            df['primaryK'],
            df['fieldName'],
            df['notNull']
          )
        )
      })
      return new SqlTable(this.name, attr)
    } catch (error) {
      throw new errors.ServerError(
        errors.ERROR_TYPE.SQL_GENERATOR,
        errors.ERROR_LEVEL.HIGH,
        error.toString()
      )
    }
  }

  this.name = this.getName()
  this.data = this.getData()

  /**
   * Gets filename for optimal file containing code
   * @returns {string} Code filename
   */
  this.getFilename = function () {
    return this.getName() + '.sql'
  }
}

module.exports = {
  'Table': SqlTable,
  'EntityParser': EntityParser
}
