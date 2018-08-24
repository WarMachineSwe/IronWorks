var generator = require('../../ApplicationTier/FileGenerator/CodeGenerator/GetCode')

describe('Code generator', function () {
  it('generates code', function () {
    expect(function () {
      new generator.JavaGenerator(null).getCode()
    }).toThrow()
  })
})
