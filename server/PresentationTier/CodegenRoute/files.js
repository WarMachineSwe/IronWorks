var io = require('../../utils/io')
var packer = require('./packaging')

const SQL_JAVA_DRIVER_PATH = '../res/SqlConnection.java'
const SQL_JAVA_DRIVER = {
  'data': io.bufferFile(SQL_JAVA_DRIVER_PATH).toString(),
  'file': 'SqlConnection.java'
}

/**
 * Gets optimal location for a Java file
 * @param entity {string} raw JSON input
 * @returns {string} optimal location for Java file
 */
function getEntityPackage (entity) {
  try {
    return entity['package'].split('.').join('.')
  } catch (error) {
    return packer.DEFAULT_PACKAGE
  }
}

/**
 * Gets list of packages of all entities
 * @param entities [] of entities
 * @returns {Array} [] of string
 */
function getPackages (entities) {
  var packages = []
  entities.forEach(function (entity) {
    packages.push(getEntityPackage(entity))
  })
  return packages
}

/**
 * Gets optimal location for a Java file
 * @param pack {string} package of Java class
 * @returns {string} optimal location for Java file
 */
function getJavaLocationFromPackage (pack) {
  var tokens = pack.split('.')
  return tokens.join('/') + '/'
}

/**
 * Gets optimal location for a Java file
 * @param entity {string} raw JSON input
 * @returns {string} optimal location for Java file
 */
function getJavaLocationFromEntity (entity) {
  return getJavaLocationFromPackage(getEntityPackage(entity))
}

/**
 * Gets optimal location for a SQL file
 * @param entity {string} raw JSON input
 * @returns {string} optimal location for SQL file
 */
function getSqlLocation (entity) {
  return entity['entityName'] + '/'
}

/**
 * Gets optimal location for a Java file
 * @returns {Object} sql driver for entity
 * @param pack
 */
function getSqlDriver (pack) {
  var driver = {
    'java': SQL_JAVA_DRIVER
  }
  driver['java']['data'] = driver['java']['data'].replace(packer.SQL_DRIVER_PACKAGE, 'package ' + pack)  // add package
  driver['javaPath'] = getJavaLocationFromPackage(pack)

  return driver
}

module.exports = {
  'getPackages': getPackages,
  'getSqlDriver': getSqlDriver,
  'getSqlLocation': getSqlLocation,
  'getJavaLocation': getJavaLocationFromEntity
}
