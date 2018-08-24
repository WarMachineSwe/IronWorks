var elementsHandler = new ElementHandler()

/**
 * Computes suitable space to hide image
 * @return {number} space to hide image
 */
function hideImgSpace () {
  var out = 10 + (Math.random() * 500) * 1000
  out = '-' + out + 'px'
  return out
}

/**
 * Creates a drag image from path
 * @param path {string} location of image
 * @return {Element}
 */
function getDragImage (path) {
  var dragIcon = document.createElement('img')
  dragIcon.src = path
  dragIcon.style.width = '256px'
  var div = document.createElement('div')
  div.appendChild(dragIcon)
  div.style.position = 'absolute'
  div.style.top = '0px'
  div.style.left = hideImgSpace()  // hide from view
  document.querySelector('body').appendChild(div)
  return div
}

/**
 * Creates a drag image for actors
 * @return {Element} suitable drag image
 */
function getDragActorImage () {
  return getDragImage('/img/Actor.png')
}

/**
 * Creates a drag image for boundary
 * @return {Element} suitable drag image
 */
function getDragBoundaryImage () {
  return getDragImage('/img/Boundary.png')
}

/**
 * Creates a drag image for entity
 * @return {Element} suitable drag image
 */
function getDragEntityImage () {
  return getDragImage('/img/Entity.png')
}

/**
 * Creates a drag image for control
 * @return {Element} suitable drag image
 */
function getDragControlImage () {
  return getDragImage('/img/Control.png')
}

var ACTOR_DRAG_ICON
var BOUNDARY_DRAG_ICON
var ENTITY_DRAG_ICON
var CONTROLLER_DRAG_ICON

/**
 * Allows the element to be dropped
 * @param ev event
 */
function allowDrop (ev) {
  ev.preventDefault()
}

/**
 * Drags elements
 * @param ev event
 * @param type {string} type of object to be dragged
 */
function drag (ev, type) {
  ev.dataTransfer.setData('type', type)

  if (type === 'a') { // sets the drag image with offset
    ev.dataTransfer.setDragImage(ACTOR_DRAG_ICON, 50, 50)
  } else if (type === 'b') {
    ev.dataTransfer.setDragImage(BOUNDARY_DRAG_ICON, 50, 50)
  } else if (type === 'e') {
    ev.dataTransfer.setDragImage(ENTITY_DRAG_ICON, 50, 50)
  } else if (type === 'c') {
    ev.dataTransfer.setDragImage(CONTROLLER_DRAG_ICON, 50, 50)
  }
}

/**
 * Drops actor
 */
function dropActor () {
  elementsHandler.createActor()
}

/**
 * Drops boundary
 */
function dropBoundary () {
  elementsHandler.createBoundary()
}

/**
 * Drops entity
 */
function dropEntity () {
  elementsHandler.createEntity()
}

/**
 * Drops control
 */
function dropControl () {
  elementsHandler.createControl()
}

/**
 * Translates mouse coordinates to canvas coordinates
 */
function mouseToCanvasPosition (x, y) {
  var position = $('#canvas').position()
  var diffY = position['top']
  var diffX = position['left']
  return [x - diffX, y - diffY]
}

/**
 * Moves last put cell to specified location
 * @param x {int} x coordinate
 * @param y {int} y coordinate
 */
function moveLastCellToLocation (x, y) {
  var lastCell = GRAPH.getLastCell()
  lastCell.position(x, y)
}

/**
 * Drops element where is mouse
 * @param ev event
 */
function dropToMouse (ev) {
  var x = ev.clientX
  var y = ev.clientY

  var canvasCoordinates = mouseToCanvasPosition(x, y)
  moveLastCellToLocation(canvasCoordinates[0], canvasCoordinates[1])
}

/**
 * Drops element
 * @param ev event
 */
function drop (ev) {
  ev.preventDefault()

  try {
    var type = ev.dataTransfer.getData('type')
    var numberCells = countHowManyCells()

    if (type === 'a') {
      dropActor()
    } else if (type === 'b') {
      dropBoundary()
    } else if (type === 'e') {
      dropEntity()
    } else if (type === 'c') {
      dropControl()
    }

    var userHasDropper = (countHowManyCells() > numberCells)
    if (userHasDropper) { // just drop when element is actually created
      dropToMouse(ev)
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * Loads all drag images used
 */
function loadDragImages () {
  ACTOR_DRAG_ICON = getDragActorImage()
  BOUNDARY_DRAG_ICON = getDragBoundaryImage()
  ENTITY_DRAG_ICON = getDragEntityImage()
  CONTROLLER_DRAG_ICON = getDragControlImage()
}
