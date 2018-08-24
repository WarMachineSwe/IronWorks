describe('ElementHandler', function () {
  var elh = new ElementHandler()
  it('controls elements number', function () {
    expect(elh.canAddElements()).toBeTruthy()
  })
})

describe('ElementAdding', function () {
  var elh = new ElementHandler()
  var cmd = new Commands()
  cmd.clearAll()
  it('add elements to canvas', function () {
    GRAPH.addCell(new RobustnessModel().createElement('a'))
    var el = countHowManyCells()
    elh.addElement(new RobustnessModel().createElement('a'))
    expect(countHowManyCells()).toBeGreaterThan(el)
  })
})

describe('ElementTryingAdding', function () {
  var elh = new ElementHandler()
  var cmd = new Commands()
  cmd.clearAll()

  beforeEach(function () {
    document.body.innerHTML = __html__['spec/client/template_spec.html']
  })

  it('tries to add elements to canvas', function () {
    expect(elh.tryAddElement(new RobustnessModel().createElement('c'))).toBeTruthy()
  })

  it('tries to add elements to canvas (false)', function () {
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))
    elh.addElement(new RobustnessModel().createElement('a'))

    expect(elh.tryAddElement(new RobustnessModel().createElement('c'))).toBeFalsy()
    cmd.clearAll()
  })
})

describe('RobustnessAdding', function () {
  var cmd = new Commands()
  cmd.clearAll()
  var elh = new ElementHandler()
  it('tries to add actor to canvas', function () {
    var n = countHowManyCells()
    elh.createActor()
    expect(countHowManyCells()).toBeGreaterThan(n)
  })
  it('tries to add boundary to canvas', function () {
    var n = countHowManyCells()
    elh.createBoundary()
    expect(countHowManyCells()).toBeGreaterThan(n)
  })
  it('tries to add entity to canvas', function () {
    var n = countHowManyCells()
    elh.createEntity()
    expect(countHowManyCells()).toBeGreaterThan(n)
  })
  it('tries to add control to canvas', function () {
    var n = countHowManyCells()
    elh.createControl()
    expect(countHowManyCells()).toBeGreaterThan(n)
  })
  it('tries to add subControl to canvas', function () {
    var n = countHowManyCells()
    elh.createSubControl()
    expect(countHowManyCells()).toBeGreaterThan(n)
  })
})
