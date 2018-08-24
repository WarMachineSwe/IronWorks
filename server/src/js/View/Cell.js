/**
 * Facade for HTML canvas cell
 */
function Cell (cell) {
  this.cell = cell

  /**
   * Gets attribute of model of cell
   * @param attr attribute name
   * @returns {String} attribute value
   */
  this.getAttr = function (attr) {
    try {
      return this.cell.model.attr(attr)
    } catch (error) {
      try {
        return this.cell.attr(attr)
      } catch (error) {
        return null
      }
    }
  }

  /**
   * Sets attribute of model of cell
   * @param attr attribute name
   * @param value new attribute value
   */
  this.setAttr = function (attr, value) {
    try {
      this.cell.model.attr(attr, value)
    } catch (error) {
      try {
        this.cell.attr(attr, value)
      } catch (error) {
      }
    }
  }

  /**
   * Gets type of cell
   * @returns {String} type of cell
   */
  this.getCellType = function () {
    return this.getAttr('type/text')
  }

  /**
   * Gets text of cell
   * @returns {String} text of cell
   */
  this.getCellName = function () {
    return this.getAttr('text/text')
  }

  /**
   * Sets text of cell
   * @param newName {string} new name of cell
   */
  this.setNewName = function (newName) {
    this.setAttr('text/text', newName)  // sets new name
  }

  /**
   * Gets type of cell
   * @returns {String} type of cell
   */
  this.getFullCellType = function () {
    var type = this.getCellType()
    if (type === 'e') {
      return 'entity'
    } else if (type === 'a') {
      return 'actor'
    } else if (type === 'c') {
      return 'control'
    } else if (type === 'b') {
      return 'boundary'
    }

    return ''
  }

  /**
   * Checks if cell is entity
   * @returns {boolean} true iff type of cell is entity
   */
  this.isEntity = function () {
    return this.getCellType() === 'e'
  }

  /**
   * Checks if cell is control
   * @returns {boolean} true iff type of cell is control
   */
  this.isControl = function () {
    return this.getCellType() === 'c'
  }

  /**
   * Checks if type of cell is a object model
   * @returns {boolean} cell is a object model
   */
  this.isModel = function () {
    const models = ['e', 'c', 'a', 'b']
    return models.includes(this.getCellType())
  }
}

/**
 * Gets cell
 * @param id ID of cell
 * @returns {*} cell
 */
function getCanvasCellById (id) {
  return GRAPH.getCell(id)
}

/**
 * Gets cell
 * @param id ID of cell
 * @returns {*} cell
 */
function getCellById (id) {
  return new Cell(getCanvasCellById(id))
}
