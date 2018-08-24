var sql = require('../SqlGenerator/sql')
var java = require('../JavaGenerator/java')
var errors = require('../../Exceptions/exception')
var oop = require('../../../utils/oop')
var misc = require('../../../utils/misc')

/**
 * Template method to generate code
 * @type {{process: getCode.process}} Code generator
 */
var getCode = {
  process: function (entity, Parser, errorType) {
    try {
      var parser = new Parser(entity)
      var data = parser.getData()
      var fileName = parser.getFilename()
      return {
        'data': data.toString(),
        'file': fileName
      }
    } catch (error) {
      throw new errors.ServerError(
        errorType,
        errors.ERROR_LEVEL.MEDIUM,
        error.toString()
      )
    }
  }
}

/**
 * Generates Java code for entity
 * @param entity raw client request
 */
function JavaGenerator (entity) {
  this.generator = oop.inherit(getCode)

  /**
   * @return dictionary with data and file
   */
  this.getCode = function () {
    return this.generator.process(entity, java.EntityParser, errors.ERROR_TYPE.JAVA_GENERATOR)
  }
}

/**
 * Generates SQL code for entity
 * @param entity raw client request
 */
function SqlGenerator (entity) {
  this.generator = oop.inherit(getCode)

  /**
   * @return dictionary with data and file
   */
  this.getCode = function () {
    return this.generator.process(entity, sql.EntityParser, errors.ERROR_TYPE.SQL_GENERATOR)
  }
}

module.exports = {
  'JavaGenerator': JavaGenerator,
  'SqlGenerator': SqlGenerator
}
