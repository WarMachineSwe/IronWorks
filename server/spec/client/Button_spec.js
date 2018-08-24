describe('button', function () {
  beforeEach(function () {
    document.body.innerHTML = __html__['spec/client/button_spec.html']
  })

  it('Control that a button will be active', function () {
    var button = new TwoStateButton($('#button1'))
    expect(button.isActive()).toBe(true)
  })

  it('Change a button from inactive to active', function () {
    var button = new TwoStateButton($('#button2'))
    button.active()
    expect(button.isActive()).toBe(true)
  })

  it('Change a button from active to inactive', function () {
    var button = new TwoStateButton($('#button2'))
    button.inactive()
    expect(button.isActive()).toBe(false)
  })

  it('Change a button active or not, it depends what it has', function () {
    var button1 = new TwoStateButton($('#button1'))
    var button2 = new TwoStateButton($('#button2'))
    button1.toggle()
    button2.toggle()
    expect(button1.isActive()).toBe(false)
    expect(button2.isActive()).toBe(true)
  })

  it('Change a button inactive if you pass false', function () {
    var button = new TwoStateButton($('#button2'))
    button.setState(false)
    expect(button.isActive()).toBe(false)
  })

  it('Change a button active if you pass true', function () {
    var button = new TwoStateButton($('#button2'))
    button.setState(true)
    expect(button.isActive()).toBe(true)
  })

})
