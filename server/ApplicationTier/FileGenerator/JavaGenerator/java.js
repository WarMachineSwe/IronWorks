var sql = require('../SqlGenerator/utils')
var errors = require('../../Exceptions/exception')
var elements = require('./elements')
var utils = require('./utils')

/**
 * Model for Java class with attributes and methods
 * @param className {string} name of class to create
 * @param classPackage {JavaPackage} the package to which the file belongs
 * @param scope {string} scope of the class
 * @param attributes {JavaAttribute[]} attributes of class
 * @param primaryKeys  {JavaAttribute[]} attributes of class that are primary keys
 */
function JavaClass (className, classPackage, scope, attributes, primaryKeys) {
  var self = this
  this.scope = scope
  this.package = classPackage
  this.className = className
  this.userAttrs = attributes
  this.classAttrs = [
    new elements.Attribute(
      'SqlConnection', 'private final', elements.SQL_DRIVER_NAME, 'SqlConnection.getInstance();  ' + new elements.Comment('connection to SQL DB').toString()
    ), // driver for sql connection
    new elements.Attribute(
      'Map<String, Object>', 'private final', elements.CACHE_NAME, 'new HashMap<String, Object>();  ' + new elements.Comment('cache').toString()
    )  // cache
  ]
  this.primaryKeys = primaryKeys
  this.cacheAttrs = []
  this.primaryKeys.forEach(function (key) {
    self.cacheAttrs.push(
      new elements.Attribute(
        new elements.Type(key.param.type).construct(), 'private', key.param.name + 'Cached', 'null'
      )
    )
  })
  this.attrs = this.userAttrs.concat(this.classAttrs) // update list of attributes
  this.attrs = this.attrs.concat(this.cacheAttrs)

  /**
   * Checks if parameter is a primary key
   * @param paramName name of parameter
   * @returns {boolean} true iff parameter is primary key
   */
  this.isPrimaryKey = function (paramName) {
    for (var i = 0; i < this.primaryKeys.length; i++) {
      if (this.primaryKeys[i].param.name === paramName) {
        return true
      }
    }

    return false
  }

  /**
   * Creates WHERE clause with primary keys
   * @returns {string} SQL-like sentence for WHERE clause with primary keys
   */
  this.getSqlId = function () {
    var ids = []
    this.primaryKeys.forEach(function (key) {
      ids.push(sql.getSqlAttributeName(key.param.name) + ' = ?')
    })
    return ids.join(' AND ')
  }

  /**
   * Creates SET clause with user attributes
   * @param withPrimaryKey {boolean} adds primary key params in SET clause
   * @returns {string} SQL-like sentence for SET clause with user attributes
   */
  this.getSqlSet = function (withPrimaryKey) {
    var out = ' SET '
    var tokens = []
    this.userAttrs.forEach(function (attr) {
      var isKey = self.isPrimaryKey(attr.param.name)
      if ((isKey && withPrimaryKey) || (!isKey)) {
        tokens.push(sql.getSqlAttributeName(attr.param.name) + ' = ?')
      }
    })
    return out + tokens.join(', ')
  }

  /**
   * Creates WHERE clause with primary keys
   * @returns {string} SQL-like sentence for WHERE clause with primary keys
   */
  this.getSqlSetters = function (attributes, startingAt) {
    var out = ''
    for (var i = 0; i < attributes.length; i++) {
      var setter = new elements.Type(attributes[i].param.type).setter()
      out += elements.SQL_PREPARED_STATEMENT + '.' + setter + '(' + (startingAt + i + 1) + ', ' + attributes[i].param.name + ');' + elements.BRAKE_LINE_INNER
    }
    return out
  }

  /**
   * Creates getters to fetch result from SQL query
   * @returns {string} SQL-like sentence to fetch result from SQL query
   */
  this.getSqlGetters = function (attributes, startingAt) {
    var out = ''
    for (var i = 0; i < attributes.length; i++) {
      var type = attributes[i].param.type
      var getter = new elements.Type(type).getter()
      out += type + ' ' + attributes[i].param.name + 'Result = ' + elements.SQL_RESULT + '.' + getter + '(' + (startingAt + i + 1) + ');' + elements.BRAKE_LINE_INNER // get result
    }
    return out
  }

  /**
   * Creates an IF condition with the values from cache
   * @param paramEnd {string} ending of param to check
   * @returns {string} IF condition for cached values
   */
  this.getCacheCheck = function (paramEnd) {
    var cacheChecks = []
    this.primaryKeys.forEach(function (key) {
      cacheChecks.push(
        'this.' + key.param.name + 'Cached.equals(' + key.param.name + paramEnd + ')'
      )
    })
    var cacheIf = cacheChecks.join(' && ')
    cacheIf = 'if (' + cacheIf + ')'
    return cacheIf
  }

  /**
   * Creates list of Parameter from list of Attribute
   * @param attributes list of Attribute
   * @param includePrimaryKeys {boolean} true iff you DON'T want any primary key in the output list
   */
  this.getParamsFromAttributes = function (attributes, includePrimaryKeys) {
    var parameters = []
    attributes.forEach(function (attr) {
      var isKey = self.isPrimaryKey(attr.param.name)
      if ((isKey && includePrimaryKeys) || !isKey) {
        parameters.push(
          new elements.Parameter(attr.param.type, attr.param.name)
        )
      }
    })
    return parameters
  }

  /**
   * Creates constructor for class
   * @returns {Method} Constructor of class
   */
  this.getConstructor = function () {
    var lines = []

    this.userAttrs.forEach(function (attr) {
      lines.push('this.' + attr.param.name + ' = ' + attr.param.name + ';')
    })

    var body = lines.join(elements.BRAKE_LINE_INNER)
    if (lines.length === 0) {
      body = ''
    }

    body = elements.INNER_INDENTATION + body
    var comment = 'Creates ' + this.className + ' with specified values'

    return new elements.Method(
      new elements.MethodSignature(
        'public', '', this.className, this.getParamsFromAttributes(this.userAttrs, true), null), body, comment
    )
  }

  /**
   * Creates GET method for selected attribute of Java class
   * @param attribute {Attribute} attribute to GET
   * @returns {Method} GET method
   */
  this.getGetter = function (attribute) {
    var body = elements.INNER_INDENTATION + 'return this.' + attribute.param.name + ';'
    var returnType = attribute.param.type
    var comment = 'Gets ' + attribute.param.name
    return new elements.Method(
      new elements.MethodSignature('public', returnType, 'get' + utils.getJavaAttributeName(attribute.param.name), [], null), body, comment
    )
  }

  /**
   * Creates SET method for selected attribute of Java class
   * @param attribute {Attribute} attribute to SET
   * @returns {Method} SET method
   */
  this.getSetter = function (attribute) {
    var body = elements.INNER_INDENTATION + 'this.' + attribute.param.name + ' = ' + attribute.param.name + ';'
    var parameter = new elements.Parameter(attribute.param.type, attribute.param.name)
    var comment = 'Sets ' + attribute.param.name
    return new elements.Method(
      new elements.MethodSignature('public', 'void', 'set' + utils.getJavaAttributeName(attribute.param.name), [parameter], null), body, comment
    )
  }

  /**
   * Creates create method for selected Java class
   * @returns {Method} CREATE method written in SQL-like syntax
   */
  this.getSqlCreate = function () {
    var body = elements.INNER_INDENTATION + 'PreparedStatement ' + elements.SQL_PREPARED_STATEMENT + ' = ' + elements.SQL_DRIVER_NAME + '.getStatement("INSERT INTO '
    var attributesList = []
    var valuesList = []
    this.userAttrs.forEach(function (attr) {
      attributesList.push(
        sql.getSqlAttributeName(attr.param.name)
      )
      valuesList.push('?')
    })
    body += sql.getSqlTableName(this.className) + ' (' + attributesList.join(', ') + ') '
    body += 'VALUES (' + valuesList.join(', ') + ')");' + elements.BRAKE_LINE_INNER // end of sql prepared statement

    var inserted = 1
    this.userAttrs.forEach(function (attr) {
      var setter = new elements.Type(attr.param.type).setter()
      body += elements.SQL_PREPARED_STATEMENT + '.' + setter + '(' + (inserted).toString() + ', ' + attr.param.name + ');' + elements.BRAKE_LINE_INNER
      inserted += 1
    })

    body += elements.SQL_PREPARED_STATEMENT + '.execute();' + elements.BRAKE_LINE_INNER // execute sql statement
    body += elements.SQL_DRIVER_NAME + '.close();' // close sql driver connection
    var comment = 'Creates table for ' + this.className + ' with default values'
    return new elements.Method(
      new elements.MethodSignature('public', 'void', 'create', [], 'Exception'), body, comment
    )
  }

  /**
   * Creates create method for selected Java class
   * @returns {Method} CREATE method written in SQL-like syntax
   */
  this.getSqlRead = function () {
    var cacheIf = elements.INNER_INDENTATION + this.getCacheCheck('') + ' {  ' + new elements.Comment('cache is valid').toString() + '\n'
    cacheIf += elements.INNER_INDENTATION + elements.INDENT + 'return ' + elements.CACHE_NAME + ';\n'
    cacheIf += elements.INNER_INDENTATION + '}' + elements.BRAKE_LINE_INNER

    var body = cacheIf + '\n'

    body += elements.INNER_INDENTATION + 'PreparedStatement ' + elements.SQL_PREPARED_STATEMENT + ' = ' + elements.SQL_DRIVER_NAME
    body += '.getStatement("SELECT * FROM ' + sql.getSqlTableName(this.className) + ' '
    body += 'WHERE ' + this.getSqlId() + '");' + elements.BRAKE_LINE_INNER
    body += this.getSqlSetters(this.primaryKeys, 0) + elements.BRAKE_LINE_INNER
    body += 'ResultSet ' + elements.SQL_RESULT + ' = ' + elements.SQL_PREPARED_STATEMENT + '.executeQuery();' + elements.BRAKE_LINE_INNER // execute sql statement
    body += this.getSqlGetters(this.userAttrs, 0)
    body += elements.SQL_DRIVER_NAME + '.close();' + elements.BRAKE_LINE_INNER + elements.BRAKE_LINE_INNER // close sql driver connection

    body += new elements.Comment('insert new cached IDs').toString() + elements.BRAKE_LINE_INNER
    this.primaryKeys.forEach(function (key) {
      body += 'this.' + key.param.name + 'Cached = ' + key.param.name + ';' + elements.BRAKE_LINE_INNER
    })
    body += elements.BRAKE_LINE_INNER + new elements.Comment('insert new cached IDs').toString() + elements.BRAKE_LINE_INNER
    this.userAttrs.forEach(function (attr) {
      var constructor = new elements.Type(attr.param.type).construct()
      body += elements.CACHE_NAME + '.put("' + sql.getSqlAttributeName(attr.param.name) + '", new ' + constructor + '(' + attr.param.name + 'Result));' + elements.BRAKE_LINE_INNER
    })
    body += 'return ' + elements.CACHE_NAME + ';'

    var comment = 'Reads all columns from ' + this.className + ' table. If requested ID is cached, returns cached data'
    return new elements.Method(
      new elements.MethodSignature('public', 'Map', 'read', this.getParamsFromAttributes(this.primaryKeys, true), 'Exception'), body, comment
    )
  }

  /**
   * Creates update method for selected Java class
   * @returns {Method} UPDATE method written in SQL-like syntax
   */
  this.getSqlUpdate = function () {
    var params = this.getParamsFromAttributes(this.userAttrs, false)
    var keyParams = this.getParamsFromAttributes(this.primaryKeys, true)
    for (var i = 0; i < keyParams.length; i++) {
      keyParams[i].name = keyParams[i].name + 'SqlId'
    }
    params = params.concat(keyParams)

    var cacheIf = elements.INNER_INDENTATION + this.getCacheCheck('SqlId') + ' {  ' + new elements.Comment('write CAN' +
      ' invalidate cache').toString() + '\n'
    this.cacheAttrs.forEach(function (attr) {
      cacheIf += elements.INNER_INDENTATION + elements.INDENT + 'this.' + attr.param.name + ' = null;\n'
    })
    cacheIf += elements.INNER_INDENTATION + '}' + elements.BRAKE_LINE_INNER

    var body = cacheIf + '\n'
    body += elements.INNER_INDENTATION + 'PreparedStatement ' + elements.SQL_PREPARED_STATEMENT + ' = ' + elements.SQL_DRIVER_NAME + '.getStatement("UPDATE '
    body += sql.getSqlTableName(this.className) + this.getSqlSet(false)
    body += ' WHERE ' + this.getSqlId() + '");' + elements.BRAKE_LINE_INNER

    for (var k = 0; k < params.length; k++) {
      var setter = new elements.Type(params[k].type).setter()
      body += elements.SQL_PREPARED_STATEMENT + '.' + setter + '(' + (k + 1) + ', ' + params[k].name + ');' + elements.BRAKE_LINE_INNER
    }

    body += elements.SQL_PREPARED_STATEMENT + '.execute();' + elements.BRAKE_LINE_INNER // execute sql statement
    body += elements.SQL_DRIVER_NAME + '.close();' // close sql driver connection

    var comment = 'Updates all columns of ' + this.className + ' table. Invalidates cache if necessary'
    return new elements.Method(
      new elements.MethodSignature('public', 'void', 'update', params, 'Exception'), body, comment
    )
  }

  /**
   * Creates delete method for selected Java class
   * @returns {Method} DELETE method written in SQL-like syntax
   */
  this.getSqlDelete = function () {
    var body = elements.INNER_INDENTATION + 'PreparedStatement ' + elements.SQL_PREPARED_STATEMENT + ' = ' + elements.SQL_DRIVER_NAME + '.getStatement("DELETE FROM '
    body += sql.getSqlTableName(this.className) + ' WHERE ' + this.getSqlId() + '");' + elements.BRAKE_LINE_INNER
    body += this.getSqlSetters(this.primaryKeys, 0)
    body += elements.SQL_PREPARED_STATEMENT + '.execute();' + elements.BRAKE_LINE_INNER // execute sql statement
    body += elements.SQL_DRIVER_NAME + '.close();' // close sql driver connection
    var comment = 'Deletes from ' + this.className + ' table'

    return new elements.Method(
      new elements.MethodSignature('public', 'void', 'delete', [], 'Exception'), body, comment
    )
  }

  /**
   * Converts object to string representation
   * @returns {string} Class written in Java-like syntax
   */
  this.toString = function () {
    var out = this.package.toString() + '\n\n'
    out += elements.JAVA_IMPORTS + '\n'
    out += this.scope + ' class '
    out += className + ' {'
    this.attrs.forEach(function (attr) {
      out += '\n\t' + attr.toString()
    })

    out += elements.BRAKE_LINE_METHODS + this.getConstructor().toString() // constructor

    this.userAttrs.forEach(function (attr) {
      out += elements.BRAKE_LINE_METHODS + self.getGetter(attr).toString() // get
      out += elements.BRAKE_LINE_METHODS + self.getSetter(attr).toString() // set
    })

    if (this.userAttrs.length > 0) {
      out += elements.BRAKE_LINE_METHODS + this.getSqlCreate().toString() // C
      out += elements.BRAKE_LINE_METHODS + this.getSqlRead().toString()  // R
      out += elements.BRAKE_LINE_METHODS + this.getSqlUpdate().toString()  // U
      out += elements.BRAKE_LINE_METHODS + this.getSqlDelete().toString() // D
    }

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
    return this.raw['entityName']
  }

  /**
   * Parses Java class from raw data
   * @returns {JavaClass} Java class with raw attributes
   */
  this.getData = function () {
    try {
      var classScope = new elements.Scope('public').toString()
      var classPackage = new elements.Package(this.raw['package'])
      var classAttr = []
      var primaryKeys = []

      this.raw['dataFields'].forEach(function (df) {
        var attribute = new elements.Attribute(
          new elements.Type(df['fieldType']).toString(),
          new elements.Scope('private').toString(),
          df.fieldName,
          null
        )
        classAttr.push(attribute)
        if (df['primaryK']) {
          primaryKeys.push(attribute)
        }
      })

      return new JavaClass(this.getName(), classPackage, classScope, classAttr, primaryKeys)
    } catch (error) {
      throw new errors.ServerError(
        errors.ERROR_TYPE.JAVA_GENERATOR,
        errors.ERROR_LEVEL.HIGH,
        error.toString()
      )
    }
  }

  /**
   * Gets filename for optimal file containing code
   * @returns {string} Code filename
   */
  this.getFilename = function () {
    return this.getName() + '.java'
  }
}

module.exports = {
  'Class': JavaClass,
  'EntityParser': EntityParser
}
