var dates = require('../../utils/dates')
var mat = require('../../utils/maths')
var io = require('../../utils/io')
var misc = require('../../utils/misc')

describe('Unix timestamp', function () {
  it('converts a UNIX timestamp to YYYY-MM-DD HH:MM:SS format', function () {
    expect(new dates.UnixDateTime(1530611306).toString()).toEqual('2018-07-03 9:48:26')
    expect(new dates.UnixDateTime(0).toString()).toEqual('1970-01-01 0:00:00')
    expect(function () {
      new dates.UnixDateTime(-1)
    }).toThrow()
  })
})

describe('is Integer', function () {
  it('returns true iff input is a integer', function () {
    expect(mat.isInt(4)).toEqual(true)
    expect(mat.isInt(-4)).toEqual(true)
    expect(mat.isInt(1.1)).toEqual(false)
  })
})

describe('buffers file', function () {
  it('returns the file content', function () {
    expect(io.bufferFile('../res/SqlConnection.java').toString().split('\n')[0]).toEqual('<SqlConnectionPackage>;')
  })
})

beforeEach(function () {
  spyOn(console, 'log')
})

describe('debugs messages', function () {
  it('should prints debug messages', function () {
    expect(function () {
      misc.debug(null, 'wow')
    }).toThrow()
  })

  it('should print log message to console', function () {
    misc.debug('wow', 'wow')
    expect(console.log).toHaveBeenCalled()
  })
})
