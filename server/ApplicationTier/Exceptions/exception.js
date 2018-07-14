var dates = require('../../utils/dates')

/**
 * Levels of error occurring in server
 * @type {Object} Enum that contains every error level
 */
var ERROR_LEVEL = Object.freeze(
  {
    LOW: {
      name: 'low',
      value: 0
    },
    MEDIUM: {
      name: 'medium',
      value: 1
    },
    HIGH: {
      name: 'high',
      value: 2
    },
    CATASTROPHIC: {
      name: 'catastrophic',
      value: 3
    }
  }
)

/**
 * Types of error occurring in server
 * @type {Object} Enum that contains every error type
 */
var ERROR_TYPE = Object.freeze(
  {
    JAVA_GENERATOR: {
      name: 'while generating Java code'
    },
    SQL_GENERATOR: {
      name: 'while generating SQL code'
    },
    CODE_GENERATOR: {
      name: 'while generating Java and Sql code'
    },
    ZIPPER: {
      name: 'while zipping code'
    }
  }
)

/**
 * Message to contact assistance
 * @type {string} content of message
 */
var CONTACT_ASSISTANCE = 'Contact the IronWorks team for further assistance!'

/**
 * Models an error occurred in server-side
 * @param type {ERROR_TYPE} type of error
 * @param level {ERROR_LEVEL} type of level
 * @param message {string} Extra details about error
 */
function ServerError (type, level, message) {
  this.type = type
  this.level = level
  this.message = message

  /**
   * Converts object to string representation
   * @returns {string} Error message and details
   */
  this.toString = function () {
    var timeNow = new dates.UnixDateTime(Date.now() / 1000.0)
    var out = '[' + timeNow.toString() + '] A ' + this.level.name + ' error occurred ' + this.type.name + '. '
    out += this.message + '. ' + CONTACT_ASSISTANCE
    return out
  }
}

module.exports = {
  'ServerError': ServerError,
  'ERROR_LEVEL': ERROR_LEVEL,
  'ERROR_TYPE': ERROR_TYPE
}
