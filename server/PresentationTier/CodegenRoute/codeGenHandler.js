// var express = require('express')
// var router = express.Router()

var io = require('../../utils/io')
var zipper = require('../../utils/zipper.js')
var getcode = require('../../ApplicationTier/FileGenerator/CodeGenerator/GetCode')
var SQL_JAVA_DRIVER_PATH = '../res/SqlConnection.java'
var SQL_JAVA_DRIVER = {
  'data': io.bufferFile(SQL_JAVA_DRIVER_PATH).toString(),
  'file': 'SqlConnection.java'
}



/**
 * Creates output archive from client request
 */
function Codegen () {
  /**
   * Gets JAVA code for the entity
   * @param entity JSON-like entity from client
   * @returns {data: string with JAVA code, file: string with filename}
   */
  this.getJavaCode = function(entity) {return new getcode.GetJavaCode(entity).getCode()}

  /**
   * Gets SQL code for the entity
   * @param entity JSON-like entity from client
   * @returns {data: string with SQL code, file: string with filename}
   */
  this.getSqlCode = function(entity)  {return new getcode.GetSqlCode(entity).getCode()}

  /**
   * Generates JAVA and SQL code for entities
   * @param entities [] of JSON-like entity from client
   */
  this.getData = function (entities) {
    var outputData = []
    for (var i in entities) {
      var entity = entities[i]
      outputData.push({
        'java': this.getJavaCode(entity),
        'sql': this.getSqlCode(entity)
      })
    }
    //console.log('sono qui')
    outputData.push({ // add SQL connection driver for java classes
      'java': SQL_JAVA_DRIVER
    })

   /* outputData.push({ // todo remove example
      'java': {
        'data': new java.JavaClass(
          'MyEntity', 'org.warmachine.ironworks.example', 'public', [
            new java.JavaAttribute('int', 'private', 'myInt', true)
          ]
        ).toString(),
        'file': 'MyEntity.java'
      }
    })*/

    return outputData
  }

  /**
   * Handles client request sending response
   * @param req {XTTHPRequest} Client request
   * @param res {XTTHPResponse} Client response
   * @param next {function} What to do next
   */
  this.process = function (req, res, next) {
    var outputData = this.getData(req.body.entities)
    zipper.multipleZipOnResponse(res, outputData, 'tar')
  }
}

module.exports = {
  'Codegen': Codegen
}
