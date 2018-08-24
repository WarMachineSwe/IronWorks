/**
 * Facade for HTML link
 */
function Link (link) {
  this.link = link

  /**
   * Gets arrow status
   * @returns {string} arrow status
   */
  this.getArrow = function () {
    return this.link.model.attributes.attrs.line.targetMarker.d
  }

  /**
   * Checks iff this link is a arrow
   * @returns {boolean} true iff has arrow
   */
  this.isArrow = function () {
    return this.getArrow() !== ''
  }

  /**
   * Adds arrow to link
   */
  this.addArrow = function () {
    this.link.model.attr({
      line: {
        targetMarker: {
          'd': 'M 10 -5 0 0 10 5 z'
        }
      }
    })
  }

  /**
   * Removes link arrow
   */
  this.removeArrow = function () {
    this.link.model.attr({
      line: {
        targetMarker: {
          'd': ''
        }
      }
    })
  }

  /**
   * Adds arrow if there is not one, removes one if there is
   */
  this.toggleArrow = function () {
    if (this.isArrow()) {
      this.removeArrow()
    } else {
      this.addArrow()
    }
  }

  /**
   * Gets source of link
   * @returns {cell} JointJs cell from where link starts
   */
  this.getSource = function () {
    return this.link.model.getSources()[0]
  }

  /**
   * Gets target of link
   * @returns {cell} JointJs cell to where link ends
   */
  this.getTarget = function () {
    return this.link.model.getSinks()[0]
  }
}
