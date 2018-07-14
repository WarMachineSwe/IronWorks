var errors = require('../../Exceptions/exception')

/**
 * Converts raw value to SQL-syntax compatible one
 * @param raw {string} Raw value
 * @returns {string} || {null} string iff valid input
 */
function SqlType (raw) {
  this.raw = raw

  /**
   * Converts obj to string representation
   * @returns {string} SQL type in SQL-like syntax
   */
  this.toString = function () {
    if (this.raw === 'BOOL') {
      return 'BOOLEAN'
    } else if (this.raw === 'INT') {
      return 'INTEGER'
    } else if (this.raw === 'CHAR') {
      return 'CHAR(60)'
    } else if (this.raw === 'STRING') {
      return 'VARCHAR(60)'
    } else if (this.raw === 'SHORT') {
      return 'SMALLINT'
    } else if (this.raw === 'BYTE') {
      return 'TINYINT'
    } else if (this.raw === 'LONG') {
      return 'BIGINT'
    } else if (this.raw === 'FLOAT') {
      return 'FLOAT'
    } else if (this.raw === 'DOUBLE') {
      return 'DOUBLE'
    } else if (this.raw === 'DATE') {
      return 'DATE'
    } else if (this.raw === 'DECIMAL') {
      return 'DECIMAL(30,9)'
    }

    return ''
  }
}

/**
 * Creates SQL attribute name from raw name
 * @param raw attribute name
 * @returns {string} SQL attribute name
 */
function getSqlAttributeName (raw) {
  return raw // todo .toUpperCase()
}

/**
 * Creates SQL table name from raw name
 * @param raw attribute name
 * @returns {string} SQL table name
 */
function getSqlTableName (raw) {
  //console.log(raw)
  return raw // todo .toUpperCase()
}

/**
 * Model for SQL attribute of table
 * @param type {string} Type of attribute
 * @param isPrimary {boolean} true iff attribute is primary key
 * @param name {string} Name of attribute
 */
function SqlAttribute (type, isPrimary, name) {
  this.type = new SqlType(type)
    //console.log(this.type)
  this.isPrimary = isPrimary
  this.name = getSqlAttributeName(name)

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

    out += ',\n'
    return out
  }
}



/**
 * Creates string representation of class with attributes
 * @param tableName {string} name of class to create
 * @param attributes {[] of JavaAttr} List of attributes of table
 */
function SqlTable (tableName, attributes) {
  this.className = tableName
  this.attrs = attributes

  /**
   * Converts object to string representation
   * @returns {string} SQL-like syntax for this object
   */
  this.toString = function () {
    var out = 'CREATE TABLE ' + this.className + ' ('
    for (var i in this.attrs) {
      out += '\n\t' + this.attrs[i].toString()
    }
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
  //console.log(this.raw)

  /**
   * Parses table name from raw data
   * @returns {string} table name
   */
  this.getName = function () {
    try {
      return getSqlTableName(this.raw['entityName'])
    } catch (error) {
      console.log(error)
      /* todo remove in production throw new errors.ServerError(
        errors.ERROR_TYPE.SQL_GENERATOR,
        errors.ERROR_LEVEL.HIGH,
        error.toString()
      )*/
    }
  }

  /**
   * Parses SQL table from raw data
   * @returns {SqlTable} SQL table with raw attributes
   */
  this.getData = function () {
    try {
      if (this.raw.dataFields !== null) {
        var attr = []
        for (var i in this.raw.dataFields) {
          //console.log(  this.raw.dataFields[i].primaryK)
          attr[i] = new SqlAttribute(
            this.raw.dataFields[i].fieldType,
           this.raw.dataFields[i].primaryK,
            this.raw.dataFields[i].fieldName
          )
        }
      }
      return new SqlTable(this.name, attr)
    } catch (error) {
      console.log(error)
      /* todo remove in production throw new errors.ServerError(
        errors.ERROR_TYPE.SQL_GENERATOR,
        errors.ERROR_LEVEL.HIGH,
        error.toString()
      )*/
    }
  }

    this.name = this.getName()
    //console.log(this.name)
    this.data = this.getData()
    //console.log(this.data)
  /**
   * Gets filename for optimal file containing code
   * @returns {string} Code filename
   */
  this.getFilename = function () {
    return this.getName() + '.sql'
  }
}

module.exports = {
  'EntityParser': EntityParser,
  'getSqlAttributeName': getSqlAttributeName,
  'getSqlTableName': getSqlTableName
}
