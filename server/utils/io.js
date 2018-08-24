var fs = require('fs')
var path = require('path')

/**
 * Buffers file from path
 * @param relPath {string} path to buffer
 * @return {Buffer | string} content of file
 */
function bufferFile (relPath) {
  return fs.readFileSync(path.join(__dirname, relPath))
}

module.exports = {
  'bufferFile': bufferFile
}
