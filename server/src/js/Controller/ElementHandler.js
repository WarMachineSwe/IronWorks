const DEFAULT_PACKAGE = 'org.warmachine.ironworks.generated'

/**
 * Handles elements
 */
function ElementHandler () {
  /**
   * Checks if user can actually add a new element
   * @return {boolean}
   */
  this.canAddElements = function () {
    return countHowManyCells() < MAX_CELLS
  }

  /**
   * Ads a element to the canvas
   * @param element {joint cell} element to be added in graph
   */
  this.addElement = function (element) {
    DB.set('change', true)
    GRAPH.addCell(element)
  }

  /**
   * Attempts to add a element to the canvas
   * @param element {joint cell} element to be added in graph
   */
  this.tryAddElement = function (element) {
    if (this.canAddElements()) {
      this.addElement(element)
      return true
    }

    errs.msg('Attention', 'You have reached the maximum number of elements!')
    return false
  }

  /**
   * Creates a actor and puts it in canvas
   */
  this.createActor = function () {
    this.tryAddElement(new RobustnessModel().createElement('a'))
  }

  /**
   * Creates a boundary and puts it in canvas
   */
  this.createBoundary = function () {
    this.tryAddElement(new RobustnessModel().createElement('b'))
  }

  /**
   * Creates a control and puts it in canvas
   */
  this.createControl = function () {
    var obj = new RobustnessModel().createElement('c')
    if (this.tryAddElement(obj)) {
      var name = obj['_previousAttributes'].attrs.text.text
      DB.appendToArray('controls', {
        'id': GRAPH.getLastCell().id,
        'name': name,
        'sub': []
      })
    }
  }

  /**
   * Creates a sub-control and puts it in canvas
   */
  this.createSubControl = function () {
    this.addElement(new RobustnessModel().createElement('s'))
  }

  /**
   * Creates a entity and puts it in canvas
   */
  this.createEntity = function () {
    var obj = new RobustnessModel().createElement('e')
    GRAPH.addCell(obj)

    if (this.tryAddElement(obj)) {
      var name = obj['_previousAttributes'].attrs.text.text
      DB.appendToArray('entities', {
        'entityId': GRAPH.getLastCell().id,
        'package': DEFAULT_PACKAGE,
        'entityName': name,
        'dataFields': []
      })
    }
  }
}
