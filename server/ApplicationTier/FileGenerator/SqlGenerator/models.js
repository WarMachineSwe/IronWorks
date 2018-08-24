/**
 * Possible scopes in Sql code
 * @type {Object} Enum that contains every scopes in Sql code
 */
const SQL_TYPE = Object.freeze(
  {
    INT: {
      name: 'int',
      value: 'INTEGER'
    },
    BOOL: {
      name: 'bool',
      value: 'BOOLEAN'
    },
    CHAR: {
      name: 'char',
      value: 'CHAR(60)'
    },
    SHORT: {
      name: 'short',
      value: 'SMALLINT'
    },
    LONG: {
      name: 'long',
      value: 'BIGINT'
    },
    FLOAT: {
      name: 'float',
      value: 'FLOAT'
    },
    DOUBLE: {
      name: 'double',
      value: 'DOUBLE'
    },
    DECIMAL: {
      name: 'decimal',
      value: 'DECIMAL(30,9)'
    },
    DATE: {
      name: 'date',
      value: 'DATE'
    },
    STRING: {
      name: 'string',
      value: 'VARCHAR(60)'
    },
    BYTE: {
      name: 'byte',
      value: 'TINYINT'
    },
    ERROR: {
      name: 'error',
      value: 'error'
    }
  }
)

module.exports = {
  'SQL_TYPE': SQL_TYPE
}
