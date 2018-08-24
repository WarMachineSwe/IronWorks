/**
 * Validates coordinates in reference to min and max
 * @param minCoordinate {float} min coordinate
 * @param maxCoordinate {float} max coordinate
 * @param newCoordinate {float} coordinate
 * @return {float} validated coordinate
 */
function validateCoordinate (minCoordinate, maxCoordinate, newCoordinate) {
  if (newCoordinate < minCoordinate) {
    return minCoordinate
  }

  if (newCoordinate > maxCoordinate) {
    return maxCoordinate
  }

  return newCoordinate
}

/**
 * Validates position in reference to canvas
 * @param element {obj} position of element
 * @param offset {float} offset (like a margin)
 * @param newPosition {obj} new position
 * @return {obj} validated coordinates
 */
function validatePosition (element, offset, newPosition) {
  var maxX = element['width'] - offset
  var maxY = element['height'] - offset

  newPosition['x'] = validateCoordinate(0, maxX, newPosition['x'])
  newPosition['y'] = validateCoordinate(0, maxY, newPosition['y'])

  return newPosition
}

/**
 * Validates position to canvas
 * @param newPosition {obj} new position
 * @param offset {float} offset (like a margin)
 * @return {obj} validated coordinates
 */
function validatePositionToCanvas (newPosition, offset) {
  var canvasPosition = document.getElementById('canvas').getBoundingClientRect() // in reference to browser view
  return validatePosition(canvasPosition, offset, newPosition)
}

/**
 * Checks if hashed item is correct
 * @param item {obj} item to has
 * @param hash {string} result expected
 * @param func {func} function to hash
 * @return {boolean} true iff hashed values is the same as the expected
 */
function validateHash (item, hash, func) {
  return func(item).toString() === hash
}

/**
 * Validates a file input
 * @param evt event
 * @return {boolean} true iff input file is valid according to this app (hash measure)
 */
function validateFileInput (evt) {
  var parts = evt.target.result.split('\n')
  var checks = [
    [parts[0], parts[1]],  // pair <item, hash> to validate
    [parts[2], parts[3]]
  ]

  var isValid = true
  checks.forEach(function (couple) {
    if (!validateHash(couple[0], couple[1], CryptoJS.SHA512)) {
      isValid = false
    }
  })
  return isValid
}

/**
 * Creates a simple UUID
 * @return {string} UUID
 */
function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

/**
 * Checks if candidate is a good name for a label
 * @param candidate {string} candidate for name
 * @returns {boolean} true iff valid name
 */
function isValidLabelName (candidate) {
  try {
    return candidate.length >= 1
  } catch (error) {
    return false
  }
}
