var errors = require('../../ApplicationTier/Exceptions/exception')
var codegen = require('./codeGenHandler.js')
var validate = require('./validate')

const JAVA_VALID_IDENTIFIER = new RegExp('^([a-zA-Z_$][a-zA-Z\\d_$]*)$')
const JAVA_VALID_PACKAGE = new RegExp('(?!^abstract$|^abstract\\..*|.*\\.abstract\\..*|.*\\.abstract$|^assert$|^assert\\..*|.*\\.assert\\..*|.*\\.assert$|^boolean$|^boolean\\..*|.*\\.boolean\\..*|.*\\.boolean$|^break$|^break\\..*|.*\\.break\\..*|.*\\.break$|^byte$|^byte\\..*|.*\\.byte\\..*|.*\\.byte$|^case$|^case\\..*|.*\\.case\\..*|.*\\.case$|^catch$|^catch\\..*|.*\\.catch\\..*|.*\\.catch$|^char$|^char\\..*|.*\\.char\\..*|.*\\.char$|^class$|^class\\..*|.*\\.class\\..*|.*\\.class$|^const$|^const\\..*|.*\\.const\\..*|.*\\.const$|^continue$|^continue\\..*|.*\\.continue\\..*|.*\\.continue$|^default$|^default\\..*|.*\\.default\\..*|.*\\.default$|^do$|^do\\..*|.*\\.do\\..*|.*\\.do$|^double$|^double\\..*|.*\\.double\\..*|.*\\.double$|^else$|^else\\..*|.*\\.else\\..*|.*\\.else$|^enum$|^enum\\..*|.*\\.enum\\..*|.*\\.enum$|^extends$|^extends\\..*|.*\\.extends\\..*|.*\\.extends$|^final$|^final\\..*|.*\\.final\\..*|.*\\.final$|^finally$|^finally\\..*|.*\\.finally\\..*|.*\\.finally$|^float$|^float\\..*|.*\\.float\\..*|.*\\.float$|^for$|^for\\..*|.*\\.for\\..*|.*\\.for$|^goto$|^goto\\..*|.*\\.goto\\..*|.*\\.goto$|^if$|^if\\..*|.*\\.if\\..*|.*\\.if$|^implements$|^implements\\..*|.*\\.implements\\..*|.*\\.implements$|^import$|^import\\..*|.*\\.import\\..*|.*\\.import$|^instanceof$|^instanceof\\..*|.*\\.instanceof\\..*|.*\\.instanceof$|^int$|^int\\..*|.*\\.int\\..*|.*\\.int$|^interface$|^interface\\..*|.*\\.interface\\..*|.*\\.interface$|^long$|^long\\..*|.*\\.long\\..*|.*\\.long$|^native$|^native\\..*|.*\\.native\\..*|.*\\.native$|^new$|^new\\..*|.*\\.new\\..*|.*\\.new$|^package$|^package\\..*|.*\\.package\\..*|.*\\.package$|^private$|^private\\..*|.*\\.private\\..*|.*\\.private$|^protected$|^protected\\..*|.*\\.protected\\..*|.*\\.protected$|^public$|^public\\..*|.*\\.public\\..*|.*\\.public$|^return$|^return\\..*|.*\\.return\\..*|.*\\.return$|^short$|^short\\..*|.*\\.short\\..*|.*\\.short$|^static$|^static\\..*|.*\\.static\\..*|.*\\.static$|^strictfp$|^strictfp\\..*|.*\\.strictfp\\..*|.*\\.strictfp$|^super$|^super\\..*|.*\\.super\\..*|.*\\.super$|^switch$|^switch\\..*|.*\\.switch\\..*|.*\\.switch$|^synchronized$|^synchronized\\..*|.*\\.synchronized\\..*|.*\\.synchronized$|^this$|^this\\..*|.*\\.this\\..*|.*\\.this$|^throw$|^throw\\..*|.*\\.throw\\..*|.*\\.throw$|^throws$|^throws\\..*|.*\\.throws\\..*|.*\\.throws$|^transient$|^transient\\..*|.*\\.transient\\..*|.*\\.transient$|^try$|^try\\..*|.*\\.try\\..*|.*\\.try$|^void$|^void\\..*|.*\\.void\\..*|.*\\.void$|^volatile$|^volatile\\..*|.*\\.volatile\\..*|.*\\.volatile$|^while$|^while\\..*|.*\\.while\\..*|.*\\.while$)(^(?:[a-z_]+(?:\\d*[a-zA-Z_]*)*)(?:\\.[a-z_]+(?:\\d*[a-zA-Z_]*)*)*$)')
const JAVA_RESERVED_WORDS = [
  'abstract',
  'assert',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'goto',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'void',
  'volatile',
  'while'
]
const JAVA_ERROR = 'User input is not valid according to Java standards. Possibles causes are: forgot to set' +
  ' at least one primary key, used a reserved Java word as name, invalid name for class, attributes' +
  ' or package'

const SQL_VALID_IDENTIFIER = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$')
const SQL_RESERVED_WORDS = [
  'accessible',
  'add',
  'all',
  'alter',
  'analyze',
  'and',
  'as',
  'asc',
  'asensitive',
  'before',
  'between',
  'bigint',
  'binary',
  'blob',
  'both',
  'by',
  'call',
  'cascade',
  'case',
  'change',
  'char',
  'character',
  'check',
  'collate',
  'column',
  'condition',
  'constraint',
  'continue',
  'convert',
  'create',
  'cross',
  'cume_dist',
  'current_date',
  'current_time',
  'current_timestamp',
  'current_user',
  'cursor',
  'database',
  'databases',
  'day_hour',
  'day_microsecond',
  'day_minute',
  'day_second',
  'dec',
  'decimal',
  'declare',
  'default',
  'delayed',
  'delete',
  'dense_rank',
  'desc',
  'describe',
  'deterministic',
  'distinct',
  'distinctrow',
  'div',
  'double',
  'drop',
  'dual',
  'each',
  'else',
  'elseif',
  'empty',
  'enclosed',
  'escaped',
  'except',
  'except',
  'exists',
  'exit',
  'explain',
  'false',
  'fetch',
  'first_value',
  'float',
  'float4',
  'float8',
  'for',
  'force',
  'foreign',
  'from',
  'fulltext',
  'generated',
  'get',
  'grant',
  'group',
  'grouping',
  'groups',
  'having',
  'high_priority',
  'hour_microsecond',
  'hour_minute',
  'hour_second',
  'if',
  'ignore',
  'in',
  'index',
  'infile',
  'inner',
  'inout',
  'insensitive',
  'insert',
  'int',
  'int1',
  'int2',
  'int3',
  'int4',
  'int8',
  'integer',
  'interval',
  'into',
  'io_after_gtids',
  'io_before_gtids',
  'is',
  'iterate',
  'join',
  'json_table',
  'key',
  'keys',
  'kill',
  'lag',
  'last_value',
  'lead',
  'leading',
  'leave',
  'left',
  'like',
  'limit',
  'linear',
  'lines',
  'load',
  'localtime',
  'localtimestamp',
  'lock',
  'long',
  'longblob',
  'longtext',
  'loop',
  'low_priority',
  'master_bind',
  'master_ssl_verify_server_cert',
  'match',
  'maxvalue',
  'mediumblob',
  'mediumint',
  'mediumtext',
  'middleint',
  'minute_microsecond',
  'minute_second',
  'mod',
  'modifies',
  'natural',
  'no_write_to_binlog',
  'not',
  'nth_value',
  'ntile',
  'null',
  'numeric',
  'of',
  'on',
  'optimize',
  'optimizer_costs',
  'option',
  'optionally',
  'or',
  'order',
  'out',
  'outer',
  'outfile',
  'over',
  'partition',
  'percent_rank',
  'persist',
  'persist',
  'persist_only',
  'precision',
  'primary',
  'procedure',
  'purge',
  'range',
  'rank',
  'read',
  'read_write',
  'reads',
  'real',
  'recursive',
  'references',
  'regexp',
  'release',
  'rename',
  'repeat',
  'replace',
  'require',
  'resignal',
  'restrict',
  'return',
  'revoke',
  'right',
  'rlike',
  'row_number',
  'schema',
  'schemas',
  'second_microsecond',
  'select',
  'sensitive',
  'separator',
  'set',
  'show',
  'signal',
  'smallint',
  'spatial',
  'specific',
  'sql',
  'sql_big_result',
  'sql_calc_found_rows',
  'sql_small_result',
  'sqlexception',
  'sqlstate',
  'sqlwarning',
  'ssl',
  'starting',
  'stored',
  'straight_join',
  'system',
  'table',
  'terminated',
  'then',
  'tinyblob',
  'tinyint',
  'tinytext',
  'to',
  'trailing',
  'trigger',
  'true',
  'undo',
  'union',
  'unique',
  'unlock',
  'unsigned',
  'update',
  'usage',
  'use',
  'using',
  'utc_date',
  'utc_time',
  'utc_timestamp',
  'values',
  'varbinary',
  'varchar',
  'varcharacter',
  'varying',
  'virtual',
  'when',
  'where',
  'while',
  'with',
  'write',
  'xor',
  'year_month',
  'zerofill'
]
const SQL_ERROR = 'User input is not valid according to SQL standards. Possibles causes are: forgot to set at' +
  ' least one primary key, used a reserved SQL word as name, invalid name for class, attributes or' +
  ' package'

/**
 * Checks if candidate is a valid package name for Java classes
 * @param candidate {string} package name
 * @return {boolean} true iff package name is valid
 */
function isValidPackage (candidate) {
  return JAVA_VALID_PACKAGE.test(candidate)
}

/**
 * Checks if there are 2 or more entities with same name and package in list
 * @param entities {[]} list of entities
 * @return {boolean} true iff there is a duplicate entity
 */
function areThereDuplicates (entities) {
  var entityList = []

  for (var i = 0; i < entities.length; i++) {
    var hash = entities[i]['entityName'] + entities[i]['package']  // simple hash to check name + package duplicates
    if (entityList.includes(hash)) {
      return true
    }

    entityList.push(hash)
  }

  return false
}

/**
 * Generates the proxy-codegen class that handles the request and if the conditions are satisfied instance a codeGenerator obj
 */
function Proxygen () {
  var self = this
  this.gen = new codegen.Codegen()

  /**
   *
   * @param req
   */
  this.validateRequest = function (req) {
    var entities = this.gen.getEntities(req)
    entities.forEach(function (entity) {
      if (entity['entityName'] === null) {
        throw new errors.ServerError(
          errors.ERROR_TYPE.INPUT_VALIDATING,
          errors.ERROR_LEVEL.LOW,
          'Cannot parse entity name'
        )
      }

      if (entity['package'] === null) {
        throw new errors.ServerError(
          errors.ERROR_TYPE.INPUT_VALIDATING,
          errors.ERROR_LEVEL.LOW,
          'Cannot parse entity package'
        )
      }

      if (entity['dataFields'] === null) {
        throw new errors.ServerError(
          errors.ERROR_TYPE.INPUT_VALIDATING,
          errors.ERROR_LEVEL.LOW,
          'Cannot parse entity attributes'
        )
      }

      entity['dataFields'].forEach(function (df) {
        if (df['fieldType'] === null) {
          throw new errors.ServerError(
            errors.ERROR_TYPE.INPUT_VALIDATING,
            errors.ERROR_LEVEL.LOW,
            'Cannot parse attribute type'
          )
        }

        if (df['fieldName'] === null) {
          throw new errors.ServerError(
            errors.ERROR_TYPE.INPUT_VALIDATING,
            errors.ERROR_LEVEL.LOW,
            'Cannot parse attribute name'
          )
        }

        if (df['primaryK'] === null) {
          throw new errors.ServerError(
            errors.ERROR_TYPE.INPUT_VALIDATING,
            errors.ERROR_LEVEL.LOW,
            'Cannot parse primary key'
          )
        }

        if (df['fnotNull'] === null) {
          throw new errors.ServerError(
            errors.ERROR_TYPE.INPUT_VALIDATING,
            errors.ERROR_LEVEL.LOW,
            'Cannot parse attribute nullity'
          )
        }

      })
    })
  }

  /**
   * Validates entity as a java class
   * @param entity {obj} client request
   * @return {boolean} true iff entity is valid (can be parsed to be transformed into Java class)
   */
  this.javaValidate = function (entity) {
    var javaValid = new validate.Validator(
      entity, JAVA_VALID_IDENTIFIER, JAVA_RESERVED_WORDS
    ).isValid()
    javaValid = javaValid && isValidPackage(entity['package'])
    return javaValid
  }

  /**
   * Validates entity as a sql table
   * @param entity {obj} client request
   * @return {boolean} true iff entity is valid (can be parsed to be transformed into Sql class)
   */
  this.sqlValidate = function (entity) {
    return new validate.Validator(entity, SQL_VALID_IDENTIFIER, SQL_RESERVED_WORDS).isValid()
  }

  /**
   * Validates client request
   * @param req {XHTTPRequest} client request
   * @return {boolean} true iff request data is valid (can be parsed correctly)
   */
  this.validateData = function (req) {
    var entities = this.gen.getEntities(req)
    entities.forEach(function (entity) {
      if (!self.javaValidate(entity)) {
        throw new errors.ServerError(
          errors.ERROR_TYPE.INPUT_VALIDATING,
          errors.ERROR_LEVEL.HIGH,
          JAVA_ERROR
        )
      }

      if (!self.sqlValidate(entity)) {
        throw new errors.ServerError(
          errors.ERROR_TYPE.INPUT_VALIDATING,
          errors.ERROR_LEVEL.HIGH,
          SQL_ERROR
        )
      }

      if (areThereDuplicates(entities)) {
        throw new errors.ServerError(
          errors.ERROR_TYPE.INPUT_VALIDATING,
          errors.ERROR_LEVEL.HIGH,
          'Duplicate entity found! Two entities must have different name and package!'
        )
      }
    })

    return true
  }

  /**
   * Validates client request
   * @param req {XHTTPRequest} client request
   * @return {boolean} true iff request is valid (can be parsed correctly)
   */
  this.validate = function (req) {
    this.validateRequest(req)
    this.validateData(req)
    return true
  }

  /**
   * Proxyes client request to client request handler
   * @param req {XHTTPRequest} Client request
   * @param res {XHTTPResponse} Client response
   * @param next {function} What to do next
   */
  this.process = function (req, res, next) {
    try {
      if (this.validate(req)) {
        this.gen.process(req, res, next)
      } else {
        throw new errors.ServerError(
          errors.ERROR_TYPE.INPUT_VALIDATING,
          errors.ERROR_LEVEL.HIGH,
          'Cannot process /codegen request'
        )
      }
    } catch (e) {
      res.status(500) // set status code
      var error = errors.parseError(e)
      res.json({
        'title': error.getTitle(),
        'message': error.toString()
      })
    }
  }
}

module.exports = {
  'isValidPackage': isValidPackage,
  'areThereDuplicates': areThereDuplicates,
  'Proxygen': Proxygen
}
