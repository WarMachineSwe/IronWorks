/**
 * Possible scopes in Java code
 * @type {Object} Enum that contains every scopes in Java code
 */
const JAVA_SCOPE = Object.freeze(
  {
    PUBLIC: {
      name: 'public',
      value: 'public'
    },
    PROTECTED: {
      name: 'protected',
      value: 'protected'
    },
    PACKAGE: {
      name: 'package',
      value: ''
    },
    PRIVATE: {
      name: 'private',
      value: 'private'
    },
    ERROR: {
      name: 'error',
      value: 'error'
    }
  }
)

/**
 * Possible scopes in Java code
 * @type {Object} Enum that contains every scopes in Java code
 */
const JAVA_TYPE = Object.freeze(
  {
    INT: {
      name: 'int',
      value: 'int',
      obj: 'Integer'
    },
    BOOL: {
      name: 'bool',
      value: 'boolean',
      obj: 'Boolean'
    },
    BOOLEAN: {
      name: 'boolean',
      value: 'boolean',
      obj: 'Boolean'
    },
    CHAR: {
      name: 'char',
      value: 'char',
      obj: 'Char'
    },
    SHORT: {
      name: 'short',
      value: 'short',
      obj: 'Short'
    },
    LONG: {
      name: 'long',
      value: 'long',
      obj: 'Long'
    },
    FLOAT: {
      name: 'float',
      value: 'float',
      obj: 'Float'
    },
    DOUBLE: {
      name: 'double',
      value: 'double',
      obj: 'Double'
    },
    DECIMAL: {
      name: 'decimal',
      value: 'double',
      obj: 'Double'
    },
    DATE: {
      name: 'date',
      value: 'Date',
      obj: 'Date'
    },
    LOCALDATE: {
      name: 'date',
      value: 'Date',
      obj: 'Date'
    },
    STRING: {
      name: 'string',
      value: 'String',
      obj: 'String'
    },
    BYTE: {
      name: 'byte',
      value: 'byte',
      obj: 'Byte'
    },
    ERROR: {
      name: 'error',
      value: 'error',
      obj: 'Object'
    }
  }
)

module.exports = {
  'JAVA_SCOPE': JAVA_SCOPE,
  'JAVA_TYPE': JAVA_TYPE
}
