var errors = require('../../ApplicationTier/Exceptions/exception')

describe('Server error', function () {
  it('creates an error', function () {
    var error = new errors.ServerError(
      errors.ERROR_TYPE.CODE_GENERATOR,
      errors.ERROR_LEVEL.HIGH,
      'message'
    )

    expect(
      error.toString()
    ).toContain('message.')

    expect(
      error.getTitle()
    ).toContain('HIGH ERROR WHILE GENERATING JAVA AND SQL CODE!')
  })

  it('builds an error', function () {
    var builder = new errors.ServerErrorBuilder()
      .withType(errors.ERROR_TYPE.CODE_GENERATOR)
      .withLevel(errors.ERROR_LEVEL.HIGH)
      .withMessage('message')

    expect(
      builder
        .build()
        .getTitle()
    ).toContain('HIGH ERROR WHILE GENERATING JAVA AND SQL CODE!')
  })

  it('builds a empty error', function () {
    expect(
      new errors.ServerErrorBuilder()
        .build()
        .getTitle()
    ).toContain('LOW ERROR WHILE PROCESSING YOUR REQUEST')
  })

  it('parses an error', function () {
    expect(
      errors.parseError({
        'type': errors.ERROR_TYPE.CODE_GENERATOR,
        'level': errors.ERROR_LEVEL.HIGH
      }).toString()
    ).toContain('Contact Warmachine team for further assistance!')

    expect(
      errors.parseError({
        'type': errors.ERROR_TYPE.CODE_GENERATOR,
        'level': errors.ERROR_LEVEL.HIGH,
        'message': 'message'
      }).toString()
    ).toContain('message')
  })
})
