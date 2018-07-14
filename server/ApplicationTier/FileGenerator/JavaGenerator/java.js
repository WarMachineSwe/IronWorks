var sql = require('../SqlGenerator/sql.js')
var errors = require('../../Exceptions/exception')
const SQL_DRIVER_NAME = 'sqlConnectionDriver'
const SQL_PREPARED_STATEMENT = 'stmt'
const SQL_RESULT = 'resultTable'
const JAVA_RESULT = 'result'
const INNER_INDENTATION = '\t\t'
const BRAKE_LINE_INNER = '\n' + INNER_INDENTATION
const BRAKE_LINE_METHODS = '\n\n\t'
const JAVA_IMPORTS = 'import java.sql.DriverManager;\n' +
  'import java.sql.Connection;\n' +
  'import java.sql.PreparedStatement;\n' +
  'import java.sql.ResultSet;\n' +
  'import java.sql.Date;\n'

/**
 * @param raw {string} Raw JSON value
 */
function JavaScope (raw) {
  this.raw = raw

  /**
   * Converts obj to string representation
   * @returns {string} The exact scope
   */
  this.toString = function () {
    if (this.raw === 'public') {
      return 'public'
    } else if (this.raw === 'private') {
      return 'private'
    } else if (this.raw === 'package') {
      return ''
    } else if (this.raw === 'protected') {
      return 'protected'
    }

    return ''
  }
}

/**
 * @param raw {string} JSON-written value of type
 */
function JavaType (raw) {
  this.raw = raw

  this.setter = function () {
    if (this.raw === 'int') {
      return 'setInt'
    } else if (this.raw === 'BOOL') {
      return 'setBoolean'
    } else if (this.raw === 'CHAR') {
      return 'setChar'
    } else if (this.raw === 'SHORT') {
      return 'setShort'
    } else if (this.raw === 'LONG') {
      return 'setLong'
    } else if (this.raw === 'FLOAT') {
      return 'setFloat'
    } else if (this.raw === 'DOUBLE' || raw === 'DECIMAL') {
      return 'setDouble'
    } else if (this.raw === 'DATE') {
      return 'setDate'
    } else if (this.raw === 'string') {
      return 'setString'
    } else if (this.raw === 'BYTE') {
      return 'setByte'
    }

    return ''
  }

  this.getter = function () {
    if (this.raw === 'int') {
      return 'getInt'
    } else if (this.raw === 'BOOL') {
      return 'getBoolean'
    } else if (this.raw === 'CHAR') {
      return 'getChar'
    } else if (this.raw === 'SHORT') {
      return 'getShort'
    } else if (this.raw === 'LONG') {
      return 'getLong'
    } else if (this.raw === 'FLOAT') {
      return 'getFloat'
    } else if (this.raw === 'DOUBLE' || raw === 'DECIMAL') {
      return 'getDouble'
    } else if (this.raw === 'DATE') {
      return 'getDate'
    } else if (this.raw === 'string') {
      return 'getString'
    } else if (this.raw === 'BYTE') {
      return 'getByte'
    }

    return ''
  }

  /**
   * Converts obj to string representation
   * @returns @return {string} Type of an attribute
   */
  this.toString = function () {
    if (this.raw === 'INT') {
      return 'int'
    } else if (this.raw === 'BOOL') {
      return 'boolean'
    } else if (this.raw === 'CHAR') {
      return 'char'
    } else if (this.raw === 'SHORT') {
      return 'short'
    } else if (this.raw === 'LONG') {
      return 'long'
    } else if (this.raw === 'FLOAT') {
      return 'float'
    } else if (this.raw === 'DOUBLE' || raw === 'DECIMAL') {
      return 'double'
    } else if (this.raw === 'DATE') {
      return 'LocalDate'
    } else if (this.raw === 'STRING') {
      return 'String'
    } else if (this.raw === 'BYTE') {
      return 'byte'
    }

    return ''
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

  this.toString = function () {
    return this.type + ' ' + this.name
  }
}

/**
 * Model for attributes of a Java class
 * @param type {string} type of the attribute
 * @param scope {string} scope of the attribute
 * @param name {string} name of the attribute
 * @param requiredByUser {null} || {bool} true iff is required by the user
 */
function JavaAttribute (type, scope, name, requiredByUser) {
  this.param = new JavaParameter(type, name)
  this.scope = scope
  this.requiredByUser = requiredByUser

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

    out += ';'
    return out
  }
}

/**
 * Model for Java method signature
 * @param scope {string} Scope of method
 * @param returnType {string} Return type of method
 * @param name {string} Name of method
 * @param parameters {[] of JavaParameter} parameters of method
 * @param exception {string} name of exception thrown by method
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
    for (var i in this.parameters) {
      parameterList.push(this.parameters[i].toString())
    }
    out += parameterList.join(', ') + ')'

    if (this.exception !== null && this.exception) {
      out += ' throws ' + this.exception
    }

    return out
  }
}

/**
 * Model for Java method
 * @param signature {JavaMethodSignature} signature of method
 * @param body {string} body of method
 */
function JavaMethod (signature, body) {
  this.signature = signature
  this.body = body

  /**
   * Converts object to string representation
   * @returns {string} Method written in Java-like syntax
   */
  this.toString = function () {
    var out = this.signature.toString() + ' {\n'
    out += body

    if (!out.endsWith('\n')) { // add new line if necessary
      out += '\n'
    }

    out += '\t}'
    return out
  }
}

/**
 * Model for Java class with attributes and methods
 * @param className {string} name of class to create
 * @param classPackage {string} the package to which the file belongs
 * @param scope {string} scope of the class
 * @param attributes {[] of JavaAttr} attributes of class
 */
function JavaClass (className, classPackage, scope, attributes) {
  this.scope = scope
  this.package = classPackage
  this.className = className
  this.attrs = attributes
  if (this.attrs === null || this.attrs.length === 0) {
    this.attrs = []
  }
  this.attrs.push(new JavaAttribute(
    'SqlConnection', 'private', SQL_DRIVER_NAME, false
  )) // driver for sql connection
  this.primaryKey = new JavaAttribute('int', 'private', 'primaryKeyId', true) // todo set primary key
  this.attrs.push(this.primaryKey)

  /**
   * Creates constructor for class
   * @returns {JavaMethod} Constructor of class
   */
  this.getConstructor = function () {
    var parameters = []
    for (var i in this.attrs) {
      parameters[i] = new JavaParameter(this.attrs[i].param.type, this.attrs[i].param.name)
    }

    var lines = []
    for (var j in this.attrs) {
      var line = 'this.' + this.attrs[j].param.name + ' = ' + parameters[j].name + ';'
      lines.push(line)
    }
    var body = INNER_INDENTATION + lines.join(BRAKE_LINE_INNER)

    return new JavaMethod(
      new JavaMethodSignature('public', '', this.className, parameters, null), body
    )
  }

  /**
   * Creates create method for selected Java class
   * @returns {JavaMethod} CREATE method written in SQL-like syntax
   */
  this.getSqlCreate = function () {
    var body = INNER_INDENTATION + 'PreparedStatement ' + SQL_PREPARED_STATEMENT + ' = ' + SQL_DRIVER_NAME + '.getStatement("INSERT INTO '
    var attributesList = []
    var valuesList = []
    for (var i in this.attrs) {
      if (this.attrs.requiredByUser) {
        attributesList.push(
          sql.getSqlAttributeName(this.attrs[i].param.name)
        )
        valuesList.push('?')
      }
    }
    body += sql.getSqlTableName(this.className) + ' (' + attributesList.join(', ') + ') '
    body += 'VALUES (' + valuesList.join(', ') + ')");' + BRAKE_LINE_INNER // end of sql prepared statement

    for (var j in this.attrs) { // set each attribute in sql statement
      if (this.attrs[j].requiredByUser) {
        var setter = new JavaType(this.attrs[j].param.type).setter()
        body += SQL_PREPARED_STATEMENT + '.' + setter + '(' + (parseInt(j) + 1).toString() + ', ' + this.attrs[j].param.name + ');' + BRAKE_LINE_INNER
      }
    } // todo check 1, 3

    body += SQL_PREPARED_STATEMENT + '.execute();' + BRAKE_LINE_INNER // execute sql statement
    body += SQL_DRIVER_NAME + '.close();' // close sql driver connection
    return new JavaMethod(
      new JavaMethodSignature('public', 'void', 'create', [], 'Exception'), body
    )
  }

  /**
   * Creates create method for selected Java class
   * @param attribute {JavaAttribute} attribute to read
   * @returns {JavaMethod} CREATE method written in SQL-like syntax
   */
  this.getSqlRead = function (attribute) {
    var body = INNER_INDENTATION + 'PreparedStatement ' + SQL_PREPARED_STATEMENT + ' = ' + SQL_DRIVER_NAME + '.getStatement("SELECT '
    body += sql.getSqlAttributeName(attribute.param.name) + ' FROM ' + sql.getSqlTableName(this.className) + ' '
    body += 'WHERE ' + sql.getSqlAttributeName(this.primaryKey.param.name) + ' = ?");' + BRAKE_LINE_INNER

    var setter = new JavaType(this.primaryKey.param.type).setter()
    body += SQL_PREPARED_STATEMENT + '.' + setter + '(1, ' + this.primaryKey.param.name + ');' + BRAKE_LINE_INNER

    body += 'ResultSet ' + SQL_RESULT + ' = ' + SQL_PREPARED_STATEMENT + '.executeQuery();' + BRAKE_LINE_INNER // execute sql statement
    var returnType = attribute.param.type
    var getter = new JavaType(returnType).getter()
    body += returnType + ' ' + JAVA_RESULT + ' = ' + SQL_RESULT + '.' + getter + '(1);' + BRAKE_LINE_INNER // get result
    body += SQL_DRIVER_NAME + '.close();' + BRAKE_LINE_INNER // close sql driver connection
    body += 'return ' + JAVA_RESULT + ';'

    return new JavaMethod(
      new JavaMethodSignature('public', returnType, 'read' + attribute.param.name, [], 'Exception'), body
    )
  }

  /**
   * Creates update method for selected Java class
   * @param attribute {JavaAttribute} attribute to update
   * @returns {JavaMethod} UPDATE method written in SQL-like syntax
   */
  this.getSqlUpdate = function (attribute) {
    var body = INNER_INDENTATION + 'PreparedStatement ' + SQL_PREPARED_STATEMENT + ' = ' + SQL_DRIVER_NAME + '.getStatement("UPDATE '
    body += sql.getSqlTableName(this.className) + ' SET ' + sql.getSqlAttributeName(attribute.param.name) + ' = ? '
    body += 'WHERE ' + sql.getSqlAttributeName(this.primaryKey.param.name) + ' = ?");' + BRAKE_LINE_INNER

    var setter = new JavaType(attribute.param.type).setter()
    body += SQL_PREPARED_STATEMENT + '.' + setter + '(1, ' + attribute.param.name + ');' + BRAKE_LINE_INNER

    setter = new JavaType(this.primaryKey.param.type).setter()
    body += SQL_PREPARED_STATEMENT + '.' + setter + '(2, ' + this.primaryKey.param.name + ');' + BRAKE_LINE_INNER

    body += SQL_PREPARED_STATEMENT + '.execute();' + BRAKE_LINE_INNER // execute sql statement
    body += SQL_DRIVER_NAME + '.close();' // close sql driver connection

    return new JavaMethod(
      new JavaMethodSignature('public', 'void', 'update' + attribute.param.name, [], 'Exception'), body
    )
  }

  /**
   * Creates delete method for selected Java class
   * @returns {JavaMethod} DELETE method written in SQL-like syntax
   */
  this.getSqlDelete = function () {
    var body = INNER_INDENTATION + 'PreparedStatement ' + SQL_PREPARED_STATEMENT + ' = ' + SQL_DRIVER_NAME + '.getStatement("DELETE FROM '
    body += sql.getSqlTableName(this.className) + ' WHERE ' + sql.getSqlAttributeName(this.primaryKey.param.name) + ' = ?");' + BRAKE_LINE_INNER
    var setter = new JavaType(this.primaryKey.param.type).setter()
    body += SQL_PREPARED_STATEMENT + '.' + setter + '(1, ' + this.primaryKey.param.name + ');' + BRAKE_LINE_INNER
    body += SQL_PREPARED_STATEMENT + '.execute();' + BRAKE_LINE_INNER // execute sql statement
    body += SQL_DRIVER_NAME + '.close();' // close sql driver connection

    return new JavaMethod(
      new JavaMethodSignature('public', 'void', 'delete', [], 'Exception'), body
    )
  }

  /**
   * Converts object to string representation
   * @returns {string} Class written in Java-like syntax
   */
  this.toString = function () {
    var out = '// package' + ' ' + this.package + ';\n\n'
    out += JAVA_IMPORTS + '\n'
    out += this.scope + ' class '
    out += className + ' {'
    for (var i in this.attrs) {
      out += '\n\t' + this.attrs[i].toString()
    }

    out += BRAKE_LINE_METHODS + this.getConstructor().toString() // constructor
    out += BRAKE_LINE_METHODS + this.getSqlCreate().toString() // SQL Create
    if(this.attrs !== null) {
        for (var r in this.attrs) { // SQL Read
            if (this.attrs[r].requiredByUser) {
                out += BRAKE_LINE_METHODS + this.getSqlRead(this.attrs[r]).toString()
            }
        }

        for (var u in this.attrs) { // SQL Update
            if (this.attrs[u].requiredByUser) {
                out += BRAKE_LINE_METHODS + this.getSqlUpdate(this.attrs[u]).toString()
            }
        }
    }

    out += BRAKE_LINE_METHODS + this.getSqlDelete().toString() // SQL Delete
    out += '\n};'
    return out
  }
}

/**
 * Parses raw data to get JAVA TABLE
 * @param rawEntity raw JSON input
 */
function EntityParser (rawEntity) {
  this.raw = rawEntity

  /**
   * Parses class name from raw data
   * @returns {string} class name
   */
  this.getName = function () {
    try {
      return this.raw['entityName']
    } catch (error) {
      console.log(error)
      /* todo remove in production throw new errors.ServerError(
        errors.ERROR_TYPE.JAVA_GENERATOR,
        errors.ERROR_LEVEL.HIGH,
        error.toString()
      ) */
    }
  }

  /**
   * Parses Java class from raw data
   * @returns {JavaClass} Java class with raw attributes
   */
  this.getData = function () {
    try {
      var classScope = new JavaScope(this.raw['entityScope']).toString()
      var classPackage = 'pack' + this.name // todo
      var classAttr = []
      for (var i in this.raw['dataFields']) {
        classAttr[i] = new JavaAttribute(
          new JavaScope(this.raw['dataFields'][i].fieldScope).toString(),
          new JavaType(this.raw['dataFields'][i].fieldType).toString(),
          this.raw['dataFields'][i].fieldName,
          true
        )
      }
      return new JavaClass(this.name, classPackage, classScope, classAttr)
    } catch (error) {
      console.log(error)
      /* todo remove in production throw new errors.ServerError(
        errors.ERROR_TYPE.JAVA_GENERATOR,
        errors.ERROR_LEVEL.HIGH,
        error.toString()
      ) */
    }
  }
  this.name = this.getName()
  this.data = this.getData()

  /**
   * Gets filename for optimal file containing code
   * @returns {string} Code filename
   */
  this.getFilename = function () {
    // console.log('qui')
    return this.getName() + '.java'
  }
}

module.exports = {
  'EntityParser': EntityParser,
  'JavaClass': JavaClass, // todo remove in production
  'JavaAttribute': JavaAttribute
}
