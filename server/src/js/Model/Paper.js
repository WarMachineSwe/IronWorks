/**
 * Creates canvas
 * @returns {joint.dia} Canvas
 */
 function createGraph() {
    return new joint.dia.Graph()
 }
function createCanvas () {
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
    paper.on('cell:pointerdblclick', function (cellView) {
        if (cellView.model.isLink()) {
            linkLabel = cellView;
            createTextInsert()
        }
    })

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
