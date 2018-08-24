var zipper = require('../../utils/zipper.js')
var files = require('./files')
var packer = require('./packaging')
var generators = require('../../ApplicationTier/FileGenerator/CodeGenerator/GetCode')
var elements = require('../../ApplicationTier/FileGenerator/JavaGenerator/elements')

/**
 * Creates output archive from client request
 */
function Codegen () {
  /**
   * Generates JAVA and SQL code for entities
   * @param entities [] of JSON-like entity from client
   */
  this.getData = function (entities) {
    try {
      var sqlConnectionPackage = packer.getCommonPackage(files.getPackages(entities))
      var sqlConnection = files.getSqlDriver(sqlConnectionPackage)  // SqlConnection.java
      var outputData = [sqlConnection]
      entities.forEach(function (entity) {
        var javaCode = new generators.JavaGenerator(entity).getCode()
        javaCode['data'] = javaCode['data']
          .replace(elements.SQL_DRIVER_PACKAGE, sqlConnectionPackage)  // import sql connection

        outputData.push({
          'java': javaCode,
          'javaPath': files.getJavaLocation(entity),
          'sql': new generators.SqlGenerator(entity).getCode(),
          'sqlPath': files.getSqlLocation(entity)
        })
      })

      return outputData
    } catch (error) {
    }
  }

  /**
   * Parses entities from request
   * @param req HTTP request
   */
  this.getEntities = function (req) {
    return req.body['data']
  }

  /**
   * Handles client request sending response
   * @param req {XTTHPRequest} Client request
   * @param res {XTTHPResponse} Client response
   * @param next {function} What to do next
   */
  this.process = function (req, res, next) {
    var data = this.getData(this.getEntities(req))
    zipper.multipleZipOnResponse(res, data, 'tar')
  }
}

module.exports = {
  'Codegen': Codegen
}
