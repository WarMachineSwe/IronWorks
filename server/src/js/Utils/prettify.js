/**
 * Image behind joint js cell
 * @param cellId {string} cell id
 */
function CellBackgroundImage (cellId) {
  this.cellId = cellId

  /**
   * Gets image of cell
   */
  this.getImage = function () {
    var view = V(PAPER.findViewByModel(this.cellId).el)
    return view.children()[0].children()[1]['node']
  }

  /**
   * Gets source of current image
   * @return {string} link
   */
  this.getCurrentImageSrc = function () {
    return this.getImage().getAttribute('xlink:href')
  }

  /**
   * Sets source of current image
   * @param path {string} link
   */
  this.setCurrentImageSrc = function (path) {
    return this.getImage().setAttribute('xlink:href', path)
  }

  /**
   * Gets path of live version of current image
   * @return {string} path
   */
  this.getAliveSrc = function () {
    var src = this.getCurrentImageSrc()
    var tokens = src.split('.')
    tokens[tokens.length - 2] += '_live' // add live path (not to extension)

    return tokens.join('.')
  }

  /**
   * Gets path of dead version of current image
   * @return {string} path
   */
  this.getDeadSrc = function () {
    var src = this.getCurrentImageSrc()
    var tokens = src.split('.')
    var extension = tokens[tokens.length - 1]
    return src.replace('_live.' + extension, '.' + extension)
  }

  /**
   * Sets live version of current image
   */
  this.makeAlive = function () {
    var src = this.getAliveSrc()
    this.setCurrentImageSrc(src)
  }

  /**
   * Sets dead version of current image
   */
  this.makeDead = function () {
    var src = this.getDeadSrc()
    this.setCurrentImageSrc(src)
  }
}

/**
 * Highlights image of currently opened cell
 * @param id {string} id of cell
 */
function highlightImage (id) {
  try {
    var image = new CellBackgroundImage(id)
    image.makeAlive()
  } catch (error) {
  }
}

/**
 * Removes live version of image of currently opened cell
 * @param id {string} id of cell
 */
function killImage (id) {
  try {
    var image = new CellBackgroundImage(id)
    image.makeDead()
  } catch (error) {
  }
}

