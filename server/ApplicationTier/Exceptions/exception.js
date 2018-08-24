var dates = require('../../utils/dates')

/**
 * Levels of error occurring in server
 * @type {Object} Enum that contains every error level
 */
const ERROR_LEVEL = Object.freeze(
  {
    LOW: {
      name: 'low'
    },
    MEDIUM: {
      name: 'medium'
    },
    HIGH: {
      name: 'high'
    },
    CATASTROPHIC: {
      name: 'catastrophic'
    }
  }
)

/**
 * Types of error occurring in server
 * @type {Object} Enum that contains every error type
 */
const ERROR_TYPE = Object.freeze(
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
    INPUT_VALIDATING: {
      name: 'while validating your input'
    },
    ZIPPER: {
      name: 'while zipping code'
    },
    GENERAL: {
      name: 'while processing your request'
    }
  }
)

/**
 * Message to contact assistance
 * @type {string} content of message
 */
var CONTACT_ASSISTANCE = 'Contact Warmachine team for further assistance!'

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
   * Creates a meaningful title for this error
   * @return {string} title for error
   */
  this.getTitle = function () {
    return this.level.name.toUpperCase() + ' ERROR ' + this.type.name.toUpperCase() + '!'
  }

  /**
   * Converts object to string representation
   * @returns {string} Error message and details
   */
  this.toString = function () {
    var timeNow = new dates.UnixDateTime(Date.now() / 1000.0)
    var out = '[' + timeNow.toString() + '] '
    if (this.message && this.message !== null && this.message.length > 0) {
      out += this.message + '. '
    }

    out += CONTACT_ASSISTANCE
    return out
  }
}

/**
 * Builds a ServerError
 */
function ServerErrorBuilder () {
  this.type = ERROR_TYPE.GENERAL
  this.level = ERROR_LEVEL.LOW
  this.message = ''

  /**
   * Specify type of error
   * @param errorType {ERROR_TYPE} type of error
   * @return {ServerErrorBuilder} builder
   */
  this.withType = function (errorType) {
    this.type = errorType
    return this
  }

  /**
   * Specify level of error
   * @param errorLevel {ERROR_LEVEL} type of error
   * @return {ServerErrorBuilder} builder
   */
  this.withLevel = function (errorLevel) {
    this.level = errorLevel
    return this
  }

  /**
   * Specify error message
   * @param message {string} error message
   * @return {ServerErrorBuilder} builder
   */
  this.withMessage = function (message) {
    this.message = message
    return this
  }

  /**
   * Builds error
   * @return {ServerError} with specified options
   */
  this.build = function () {
    return new ServerError(
      this.type,
      this.level,
      this.message
    )
  }
}

/**
 * Parses raw error
 * @param {string || ServerError} error
 * @return {ServerError} parsed
 */
function parseError (error) {
  var builder = new ServerErrorBuilder()

  try {
    builder.withType(error.type)
  } catch (e) {
  }

  try {
    builder.withLevel(error.level)
  } catch (e) {
  }

  try {
    var message = error.message
    if ((typeof message) === (typeof 'str')) {
      builder.withMessage(message)
    } else {
      builder.withMessage(message.toString())
    }
  } catch (e) {
  }

  return builder.build()
}

module.exports = {
  'ServerErrorBuilder': ServerErrorBuilder,
  'ServerError': ServerError,
  'parseError': parseError,
  'ERROR_LEVEL': ERROR_LEVEL,
  'ERROR_TYPE': ERROR_TYPE
}
