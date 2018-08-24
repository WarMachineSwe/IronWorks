describe('creates robustness models elements', function () {
    it('return an element of robustness diagram', function () {
      var element = new RobustnessModel()
      var actor = element.createElement('a')
      var boundary = element.createElement('b')
      var control = element.createElement('c')
      var entity = element.createElement('e')
      var subControl = element.createElement('s')
      var wow = element.createElement('x')

      expect(actor.attr('type/text')).toBe('a')
      expect(boundary.attr('type/text')).toBe('b')
      expect(control.attr('type/text')).toBe('c')
      expect(entity.attr('type/text')).toBe('e')
      expect(subControl.attr('type/text')).toBe('s')
      expect(wow).toBe(undefined)
    })
})

describe('validates robustness models links', function () {
  var element = new RobustnessModel()
  var actor = element.createElement('a')
  var boundary = element.createElement('b')
  var control = element.createElement('c')
  var entity = element.createElement('e')
  var subControl = element.createElement('s')

  it('checks sub-controllers', function () {
    expect(
      element.validateByCellType(
        subControl.attr('type/text'), control.attr('type/text')
      )
    ).toBeFalsy()

    expect(
      element.validateByCellType(
        control.attr('type/text'), subControl.attr('type/text')
      )
    ).toBeFalsy()
  })

  it('checks actors', function () {
    expect(
      element.validateByCellType(
        actor.attr('type/text'), actor.attr('type/text')
      )
    ).toBeFalsy()

    expect(
      element.validateByCellType(
        actor.attr('type/text'), control.attr('type/text')
      )
    ).toBeFalsy()

    expect(
      element.validateByCellType(
        actor.attr('type/text'), entity.attr('type/text')
      )
    ).toBeFalsy()
  })

  it('checks boundaries', function () {
    expect(
      element.validateByCellType(
        boundary.attr('type/text'), entity.attr('type/text')
      )
    ).toBeFalsy()

    expect(
      element.validateByCellType(
        boundary.attr('type/text'), actor.attr('type/text')
      )
    ).toBeFalsy()
  })

  it('checks entities', function () {
    expect(
      element.validateByCellType(
        entity.attr('type/text'), boundary.attr('type/text')
      )
    ).toBeFalsy()

    expect(
      element.validateByCellType(
        entity.attr('type/text'), actor.attr('type/text')
      )
    ).toBeFalsy()

    expect(
      element.validateByCellType(
        entity.attr('type/text'), entity.attr('type/text')
      )
    ).toBeFalsy()
  })

  it('checks controls', function () {
    expect(
      element.validateByCellType(
        control.attr('type/text'), actor.attr('type/text')
      )
    ).toBeFalsy()
  })
})

