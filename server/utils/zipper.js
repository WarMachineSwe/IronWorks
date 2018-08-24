var archiver = require('archiver')
var errors = require('../ApplicationTier/Exceptions/exception')
var ROOT_FOLDER = 'code/'
var JAVA_FOLDER = ROOT_FOLDER + 'java/'
var SQL_FOLDER = ROOT_FOLDER + 'sql/'

/**
 * Zips data and sends response
 * @param res response
 * @param data {obj} data to zip
 * @param file {string} file path where to zip
 * @param compression {string} type of compression
 */
function zipOnResponse (res, data, file, compression) {
  var archive = archiver(compression)
  archive.pipe(res)
  archive.append(data, {name: file})
  archive.finalize()
}

/**
 * Zips multiple data and sends response
 * @param res response
 * @param dataFiles {[]} list of data and files
 * @param compression {string} type of compression
 */
function multipleZipOnResponse (res, dataFiles, compression) {
  try {
    var archive = archiver(compression)
    archive.pipe(res)
    dataFiles.forEach(function (file) {
      try { // add java file
        archive.append(
          file['java']['data'], {name: JAVA_FOLDER + file['javaPath'] + file['java']['file']}
        )
      } catch (error) {
      }

      try { // add sql file
        archive.append(
          file['sql']['data'], {name: SQL_FOLDER + file['sqlPath'] + file['sql']['file']}
        )
      } catch (error) {
      }
    })

    archive.finalize()
  } catch (error) {
    throw new errors.ServerError(
      errors.ERROR_TYPE.ZIPPER,
      errors.ERROR_LEVEL.HIGH,
      error.toString()
    )
  }
}

module.exports = {
  'zipOnResponse': zipOnResponse,
  'multipleZipOnResponse': multipleZipOnResponse
}
