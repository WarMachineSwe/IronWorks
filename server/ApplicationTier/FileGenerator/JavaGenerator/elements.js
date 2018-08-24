var misc = require('../../../utils/misc')
var models = require('./models')
var utils = require('./utils')

const SQL_DRIVER_PACKAGE = '<SqlConnectionImport>' // to be filled when zipping files
const SQL_DRIVER_NAME = 'sqlConnectionDriver'
const CACHE_NAME = 'cache'
const SQL_PREPARED_STATEMENT = 'stmt'
const SQL_RESULT = 'resultTable'
const INDENT = utils.addIndentation(1)
const INNER_INDENTATION = INDENT + INDENT
const BRAKE_LINE_INNER = '\n' + INNER_INDENTATION
const BRAKE_LINE_METHODS = '\n\n' + INDENT
const JAVA_IMPORTS = 'import ' + SQL_DRIVER_PACKAGE + '.SqlConnection;\n' +
  'import java.sql.DriverManager;\n' +
  'import java.sql.Connection;\n' +
  'import java.sql.PreparedStatement;\n' +
  'import java.sql.ResultSet;\n' +
  'import java.sql.Date;\n' +
  'import java.util.HashMap;\n' +
  'import java.util.Map;\n'

/**
 * @param raw {string} Raw package value
 */
function JavaPackage (raw) {
  this.raw = raw
  this.parsed = null

  /**
   * Parses raw package
   */
  this.parse = function () {
    if (!this.raw.startsWith('package')) {
      this.parsed = 'package ' + this.raw
    } else {
      this.parsed = this.raw
    }

    if (!this.parsed.endsWith(';')) {
      this.parsed += ';'
    }
  }

  /**
   * Converts obj to string representation
   * @returns {string} The exact scope
   */
  this.toString = function () {
    if (!this.raw || this.raw === null) {
      return ''
    }

    this.parse()
    return this.parsed
  }
}

/**
 * @param raw {string} Raw JSON value
 */
function JavaScope (raw) {
  this.raw = raw.toLowerCase()
  this.parsed = null

  /**
   * Parses raw scope
   */
  this.parse = function () {
    var keys = Object.keys(models.JAVA_SCOPE)
    for (var i = 0; i < keys.length; i++) {
      var scope = models.JAVA_SCOPE[keys[i]]
      if (scope.name === this.raw) {
        this.parsed = scope
      }
    }

    if (this.parsed === null) {
      this.parsed = models.JAVA_SCOPE.ERROR
    }
  }

  /**
   * Converts obj to string representation
   * @returns {string} The exact scope
   */
  this.toString = function () {
    this.parse()
    return this.parsed.value
  }
}

/**
 * @param raw {string} Raw Java comment
 */
function JavaComment (raw) {
  this.raw = raw

  /**
   * Converts obj to string representation
   * @returns {string} The Java-syntax compatible comment
   */
  this.toString = function () {
    return '// ' + this.raw
  }
}

/**
 * @param raw {string} JSON-written value of type
 */
function JavaType (raw) {
  this.raw = raw.toLowerCase()
  this.parsed = null

  /**
   * Parses raw type
   */
  this.parse = function () {
    var keys = Object.keys(models.JAVA_TYPE)
    for (var i = 0; i < keys.length; i++) {
      var type = models.JAVA_TYPE[keys[i]]
      if (type.name === this.raw) {
        this.parsed = type
      }
    }

    if (this.parsed === null) {
      this.parsed = models.JAVA_TYPE.ERROR
    }
  }

  /**
   * Gets setter for type
   * @returns {string} text of type setter
   */
  this.setter = function () {
    this.parse()
    var type = this.parsed.value
    return 'set' + misc.toTitleCase(type)
  }

  /**
   * Gets getter for type
   * @returns {string} text of type getter
   */
  this.getter = function () {
    this.parse()
    var type = this.parsed.value
    return 'get' + misc.toTitleCase(type)
  }

  /**
   * Gets constructor for type
   * @returns {string} text of type getter
   */
  this.construct = function () {
    this.parse()
    return this.parsed.obj
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
 * Models a Java parameter of function
 * @param type type of parameter
 * @param name name of parameter
 */
function JavaParameter (type, name) {
  this.type = type
  this.name = name

  /**
   * Converts obj to string representation
   * @returns {string} Type of an attribute
   */
  this.toString = function () {
    return this.type + ' ' + this.name
  }
}

/**
 * Model for attributes of a Java class
 * @param type {string} type of the attribute
 * @param scope {string} scope of the attribute
 * @param name {string} name of the attribute
 * @param initValue {string} || {string} initialization value
 */
function JavaAttribute (type, scope, name, initValue) {
  this.param = new JavaParameter(type, name)
  this.scope = scope
  this.initValue = initValue

  /**
   * Converts object to string representation
   * @returns {string} Attribute written in Java-like syntax
   */
  this.toString = function () {
    var out = ''
    if (this.scope) {
      out += this.scope + ' '
    }

    out += this.param.toString()

    if (initValue !== null) {
      out += ' = ' + this.initValue
    }

    if (this.initValue === null || !this.initValue.includes(';')) {  // forgot EOL ;
      out += ';'
    }

    return out
  }
}

/**
 * Model for Java method signature
 * @param scope {string} Scope of method
 * @param returnType {string} Return type of method
 * @param name {string} Name of method
 * @param parameters {JavaParameter[]} parameters of method
 * @param exception {null} || {string} name of exception thrown by method
 */
function JavaMethodSignature (scope, returnType, name, parameters, exception) {
  this.scope = scope
  this.returnType = returnType
  this.name = name
  this.parameters = parameters
  this.exception = exception

  /**
   * Converts object to string representation
   * @returns {string} Signature of method written in Java-like syntax
   */
  this.toString = function () {
    var out = this.scope + ' '
    if (this.returnType.length > 0) {
      out += this.returnType + ' '
    }
    out += this.name + '('

    var parameterList = []
    this.parameters.forEach(function (param) {
      parameterList.push(param.toString())
    })
    out += parameterList.join(', ') + ')'

    if (this.exception !== null) {
      out += ' throws ' + this.exception
    }

    return out
  }
}

/**
 * Model for Java method
 * @param signature {JavaMethodSignature} signature of method
 * @param body {string} body of method
 * @param comment {string} method comment
 */
function JavaMethod (signature, body, comment) {
  this.signature = signature
  this.body = body
  this.comment = new JavaComment(comment)

  /**
   * Converts object to string representation
   * @returns {string} Method written in Java-like syntax
   */
  this.toString = function () {
    var out = this.comment.toString() + '\n'
    out += INDENT + this.signature.toString() + ' {\n'
    out += body

    if (!out.endsWith('\n')) { // add new line if necessary
      out += '\n'
    }

    out += INDENT + '}'
    return out
  }
}

module.exports = {
  'SQL_DRIVER_PACKAGE': SQL_DRIVER_PACKAGE,
  'Package': JavaPackage,
  'Scope': JavaScope,
  'Type': JavaType,
  'Parameter': JavaParameter,
  'Attribute': JavaAttribute,
  'MethodSignature': JavaMethodSignature,
  'Method': JavaMethod,
  'Comment': JavaComment,
  'SQL_DRIVER_NAME': SQL_DRIVER_NAME,
  'CACHE_NAME': CACHE_NAME,
  'SQL_PREPARED_STATEMENT': SQL_PREPARED_STATEMENT,
  'SQL_RESULT': SQL_RESULT,
  'INDENT': INDENT,
  'INNER_INDENTATION': INNER_INDENTATION,
  'BRAKE_LINE_INNER': BRAKE_LINE_INNER,
  'BRAKE_LINE_METHODS': BRAKE_LINE_METHODS,
  'JAVA_IMPORTS': JAVA_IMPORTS
}
