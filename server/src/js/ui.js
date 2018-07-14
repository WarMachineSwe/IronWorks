//DA FARE

/**
 * Checks if link between elements is doable
 * Links NOT doable are:
 *   actor -> controller  a -> c
 *   actor -> entity      a -> e
 *
 *   boundary -> boundary b -> b
 *   boundary -> entity   b -> e
 *
 *   entity -> boundary   e -> b
 *   entity -> actor      e -> a
 *   entity -> entity     e -> e
 *
 *   controller -> actor  c -> a
 * @param cellViewS {joint.shape} first element
 * @param cellViewT {joint.shape} second element
 * @returns {boolean} true iff link between them is doable
 */
function robustnessValidation (cellViewS, cellViewT) {
  var source = cellViewS.model.attr('type/text') // link's source element
  var target = cellViewT.model.attr('type/text') // link's target element

  // robustness link's rules
  if (source === 'a' && (target === 'a' || target === 'c' || target === 'e')) {
    return false
  }
  if (source === 'b' && (target === 'b' || target === 'e')) {
    return false
  }
  if (source === 'e' && (target === 'b' || target === 'a' || target === 'e')) {
    return false
  }
  return !(source === 'c' && target === 'a')
}

/**
 * Creates tools for links
 * @returns {joint.dia.ToolsView} Tools for links
 */
function createTools () {
  var sourceArrowheadTool = new joint.linkTools.SourceArrowhead()
  var targetArrowheadTool = new joint.linkTools.TargetArrowhead()
  var boundaryTool = new joint.linkTools.Boundary()
  var removeButton = new joint.linkTools.Remove()
  var infoButton = new joint.linkTools.InfoButton()

  return new joint.dia.ToolsView({
    tools: [
      sourceArrowheadTool, targetArrowheadTool,
      boundaryTool, removeButton, infoButton
    ]
  })
}

/**
 * Creates label to inser
 */
function createTextInsert () {
  $('#window-label').show()
  $('body').css({'overflow': 'hidden'})
  $('.delete').hide()
}

/**
 * Creates canvas
 * @returns {joint.dia} Canvas
 */
/*function createCanvas () {
  var canvas = $('#canvas')

  var paper = new joint.dia.Paper({
    el: canvas,
    width: canvas.width(),
    height: canvas.height(),
    model: graph,
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
      // controllo validità collegamento robustness
      if (robustnessValidation(cellViewS, cellViewT)) {
        return true
      } else {
        return false
      }

      // Prevent loop linking & Prevent linking to input ports.
      return magnetS !== magnetT
    },
    // make impossibile to move elements outside the boundary of the paper area
    restrictTranslate: true
  })

  // set links' label when doubleclicks on it
  paper.on('link:pointermove', function (cellView) {
    $('.labels').on('dblclick', function () {
      linkLabel = cellView
      createTextInsert()
    })
  }
  )

  paper.on('cell:pointerdblclick', function (cellView) {
    if (cellView.model.attr('type/text') === 'e') {
      $('#descrizioneEntity').show()
    }
  })

  // tracking of selected and previous selected elements
  var selectedEl = null// current selected element
  var previousEl = null// previous selected element

  // set selectedEl
  paper.on('cell:pointerdown', function (cellView) {
    if (!cellView.model.isLink()) {
      selectedEl = cellView.model
    }
  }
  )

  // change selectedEl to the current element and set it as previousEl
  paper.on({
    'element:pointerdown': function (elementView) {
      elementView.highlight()

      if (elementView !== previousEl && previousEl !== null) {
        previousEl.unhighlight()
      }
      previousEl = elementView
    }
  })

  // unselect all elements when click on canvas' blank spaces
  paper.on('blank:pointerclick', function () {
    if (previousEl !== null) { previousEl.unhighlight() }
    selectedEl = null
    previousEl = null
  })

  var name // current element's name
  var type // current element's type

  // editing elements name after select them
  paper.on('cell:highlight', function (cellView) {
    type = cellView.model.attr('type/text')
    $('#aName').on('click', function () {
      name = document.getElementById('textField')
      if (type === ('a') && name.value !== '') {
        selectedEl.attr('text/text', name.value)
        name.value = ''
      }
    })

    $('#bName').on('click', function () {
      name = document.getElementById('textField1')
      if (type === ('b') && name.value !== '') {
        selectedEl.attr('text/text', name.value)
        name.value = ''
      }
    })

    $('#cName').on('click', function () {
      name = document.getElementById('textField3')
      if (type === ('c') && name.value !== '') {
        selectedEl.attr('text/text', name.value)
        name.value = ''
      }
    })

    $('#eName').on('click', function () {
      name = document.getElementById('textField2')
      if (type === ('e') && name.value !== '') {
        selectedEl.attr('text/text', name.value)
        var arrayEntities = generateJSON()
        arrayEntities[searchIndexById(selectedEl.id)]['entityName'] = name.value
        db.set('entities', arrayEntities)
        name.value = ''
        db.set('change', true)
      }
    })
  })

  // add tools(remove,arrows,links movements,boundaries) to links
  paper.on('link:mouseenter', function (linkView) {
    var toolsView = createTools()
    linkView.addTools(toolsView)
  })
  // hide tools on leaving from links area
  paper.on('link:mouseleave', function (linkView) {
    linkView.hideTools()
  })

  return paper
}
*/


//FATTO DA QUA IN POI


/**
 * Creates event clickers to reset, save, open and generate
 */
function setOpsOnClick () {
  $('#reset').on('click', function () {
    graph.clear()
    var counter = 0
    if (db.get('entities')) {
      counter = db.get('entities').length
    }

    while (counter !== 0) {
      var aux = db.get('entities')
      aux.pop()
      db.set('entities', aux)
      counter--
    }
    resetDataField()
    indexDF = 0
    $('#descrizioneEntity').hide()
    db.set('change', false)
  })

  // generate json to download
  $('#save').on('click', function () {
    var jsonString = JSON.stringify(graph.toJSON()) + '\n' + JSON.stringify(generateJSON())
    var filename = 'myDiagram.json'
    downloadText(jsonString, filename)
    db.set('change', false)
  })

  // close error message
  $('#error-ok').on('click', function () {
    $('#error-msg').hide()
    $('body').css({'overflow-y': 'scroll'})
    $('.delete').show()
  })

  // open
  $('#open').on('click', function () {
    if (reloadPage(db.get('change'), 'Are you sure you want to open another project?')) {
      document.getElementById('get_file').click()
      document.getElementById('get_file').addEventListener('change', readJsonFile, false)
      db.set('change', false)
    }
  })

  $('#close').on('click', function () {
    window.location.href = 'index.html'
    db.clear()
  })

  // post codegen
  $('#generate').on('click', function () {
    var dataToSend = JSON.stringify({'entities': generateJSON()}) // todo test
    var req = new XMLHttpRequest()

    req.open('POST', '/codegen', true)
    req.onreadystatechange = handleCodegenResponse
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8') // enable json
    req.send(dataToSend)
  })
}

function setSaveDelOnClick () {
  // Chiude la finestra di inserimento label
  $('#del-label').on('click', function (e) {
    e.preventDefault()
    e.stopPropagation()
    $('#window-label').hide()
    $('body').css({'overflow-y': 'scroll'})
    $('#name-label').css({'border-color': '#ced4da'})
    $('#name-label').val('')
    $('.delete').show()
  })

  // Salva quanto inserito nella label e la inserisce su etichetta
  $('#save-label').on('click', function (e) {
    e.preventDefault()
    e.stopPropagation()

    if ($('#name-label').val()) {
      $('#window-label').hide()
      $('body').css({'overflow-y': 'scroll'})
      $('.delete').show()

      // inserire la modifica dell'etichetta
      linkLabel.model.label(0, {
        position: 0.5,
        attrs: {
          rect: {fill: 'white'},
          text: {text: $('#name-label').val()}
        }
      })
      $('#name-label').val('')
    } else {
      $('#name-label').css({'border-color': 'red'})
    }
  })
}

function reloadPage (change, msg) {
  if (change) {
    var message = 'Have you save your project?\n' + msg + '\n\nPress OK to continue or Cancel to stay on the current page.'
    if (confirm(message)) return true
    else return false
  }
  return true
}

$(window).on('beforeunload', function () {
  return 'Are you sure you want to reload this page?'
})


