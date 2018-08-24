/**
 * Creates canvas
 * @returns {joint.dia.Graph} Canvas
 */
function createGraph () {
  return new joint.dia.Graph()
}

var GRAPH = createGraph()

/**
 * Counts number of cells in graph
 * @param graph {join graph} graph
 */
function countHowManyCellInGraph (graph) {
  return graph.getElements().length
}

/**
 * Counts number of cells in graph
 */
function countHowManyCells () {
  return countHowManyCellInGraph(GRAPH)
}

/**
 * Creates canvas
 * @return {joint} canvas
 */
function createCanvas () {
  var canvas = $('#canvas')
  var width = 0
  var height = 0
  if (canvas.length === 0) {
    canvas = null
  }

  if (canvas !== null) {
    width = canvas.width()
    height = canvas.height()
  }

  var rb = new RobustnessModel()
  return new joint.dia.Paper({
    el: canvas,
    width: width,
    height: height,
    model: GRAPH,
    gridSize: 10,
    drawGrid: true,
    background: {color: 'lightgrey'},
    defaultLink: new joint.shapes.devs.LinkWithCaption(),
    multiLinks: false,
    // handle links' feature
    interactive: function (cellView) {
      if (cellView.model.isLink()) {
        return {
          arrowheadMove: true,
          vertexMove: false,
          vertexAdd: false,
          vertexRemove: false,
          labelMove: false,
          useLinkTools: true
        }
      }
      return true
    },
    // Enable link snapping
    snapLinks: {radius: 75},
    // makes impossible to create non-targeted links
    linkPinning: false,
    // check connection rules
    validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
      // Prevent linking from input ports.
      if (magnetS && magnetS.getAttribute('type') === 'input') {
        return false
      }

      // Prevent linking from output ports to input ports within one element.
      if (cellViewS === cellViewT) {
        return false
      }

      // check link is valid
      return rb.robustnessValidation(cellViewS, cellViewT)
    },
    // make impossible to move elements outside the boundary of the PAPER area
    restrictTranslate: true
  })
}

var PAPER = createCanvas() // canvas to host objects
