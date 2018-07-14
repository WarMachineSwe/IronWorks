var fs = require('fs')
var path = require('path')

function bufferFile (relPath) {
  return fs.readFileSync(path.join(__dirname, relPath))
}

module.exports = {
  'bufferFile': bufferFile
}
