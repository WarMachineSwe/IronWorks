var archiver = require('archiver')
var errors = require('../ApplicationTier/Exceptions/exception')

function zipOnResponse (res, data, file, compression) {
  var archive = archiver(compression)
  archive.on('end', function () {
    console.log(archive.pointer() + ' total bytes')
  })

  archive.pipe(res)
  archive.append(data, {name: file})
  archive.finalize()
}

function multipleZipOnResponse (res, dataFiles, compression) {
  try {
    var archive = archiver(compression)
    archive.on('end', function () {
      console.log('Archive generated: ' + archive.pointer() + ' bytes')
    })
    archive.pipe(res)

    for (var i in dataFiles) {
      try { // add java file
        archive.append(
          dataFiles[i].java.data, {name: dataFiles[i].java.file}
        )
      } catch (error) {
      }

      try { // add sql file
        archive.append(
          dataFiles[i].sql.data, {name: dataFiles[i].sql.file}
        )
      } catch (error) {
      }
    }
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
