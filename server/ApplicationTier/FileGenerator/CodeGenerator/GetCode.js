var sql = require('../SqlGenerator/sql.js')
var java = require('../JavaGenerator/java.js')
var errors = require('../../Exceptions/exception')
var oop = require('../../../utils/oop.js')

/**
 * Template method to generate code
 * @type {{process: getCode.process}} Code generator
 */
var getCode = {
    process: function (entity, Parser, errorType) {
        try {
            var parser = new Parser(entity)
            var data = parser.getData().toString()
            var fileName = parser.getFilename()
            return {
                'data': data,
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

function GetJavaCode(entity) {
    this.generator = oop.inherit(getCode)
    this.getCode = function(){
    return this.generator.process(entity, java.EntityParser, errors.ERROR_TYPE.JAVA_GENERATOR)}
}

function GetSqlCode(entity) {
    this.generator = oop.inherit(getCode)
    this.getCode = function() {
    return this.generator.process(entity, sql.EntityParser, errors.ERROR_TYPE.SQL_GENERATOR)}
}

module.exports = {
    'GetJavaCode' : GetJavaCode,
    'GetSqlCode' : GetSqlCode
}
