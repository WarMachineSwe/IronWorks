const ON_RESET_MSG = 'Are you sure you want to reset the current project?'
const ON_CLOSE_MSG = 'Are you sure you want to close the current project?'

var ops = new OperationHandler()
var cmd = new Commands()
var errs = new ErrorHandler()
var elementsHandler = new ElementHandler()
var CURRENT_LABEL = null
var LAST_EDITED_CELL = null

/**
 * Creates event clickers to reset and save label of links
 */
function LabelsEditorButtonManager () {
  var self = this

  /**
   * Edits label name in controls data
   * @param linkId {string} id of link
   * @param newName {string} new name value
   */
  this.editControlLabel = function (linkId, newName) {
    var controls = DB.get('controls', [])

    for (var j = 0; j < controls.length; j++) {
      var subs = controls[j]['sub']
      if (subs !== null) {
        for (var i = 0; i < subs.length; i++) {
          var sub = subs[i]
          if (sub['linkId'] === linkId) {
            sub['link'] = newName
          }
        }
      }
      controls[j]['sub'] = subs
    }

    DB.set('controls', controls)
  }

  this.setup = function (validName, onsuccess, withClose) {
    var closeButton = $('#del-label')
    var saveButton = $('#save-label')
    var inputLabel = $('#name-label')

    closeButton.hide()

    if (withClose) {
      closeButton.show()
      closeButton.on('click', function (e) { // close insert-label window
        e.preventDefault()
        e.stopPropagation()

        $('#name-label-window').hide()
        $('body').css({'overflow-y': 'scroll'})
        inputLabel.css({'border-color': '#ced4da'})
        inputLabel.val('')
        $('.delete').show()
      })
    }

    // save new text and set label name
    saveButton.on('click', function (e) {
      e.preventDefault()
      e.stopPropagation()

      var value = document.getElementById('name-label').value
      if (validName(value)) {
        $('#name-label-window').hide()
        $('body').css({'overflow-y': 'scroll'})
        $('.delete').show()
        DB.set('label', document.getElementById('name-label').value)

        // edit label of sub-controllers
        if (CURRENT_LABEL !== null) {
          var linkId = CURRENT_LABEL.model.id
          self.editControlLabel(linkId, value)
        }

        onsuccess()

        inputLabel.val('')
        saveButton.unbind()  // prevent reuse
      } else {
        inputLabel.css({'border-color': 'red'})
      }
    })
  }
}

/**
 * Manages events inside editor
 */
function EditorEventsManager () {
  var self = this

  // events

  /**
   * Closes this editor
   */
  this.closeEditor = function () {
    var addEntityButton = $('#plusEntity')

    var id = self.currentlyEditedElementId()
    if (new Cell(getCanvasCellById(id)).isControl()) {
      ops.removeSubControlFromScreen(id)
    }

    addEntityButton.hide()

    $('#entity-package').hide()
    $('#entity-package-label').hide()

    $('#dataField').html('') // remove all children
    $('#entityDescription').hide()

    try {
      killImage(LAST_EDITED_CELL.model.id)
    } catch (error) {
    }
  }

  /**
   * Things to do when user tries to save
   */
  this.onAttemptSave = function () {
    var htmlButton = $('#saveInfo')
    htmlButton.attr('style', '')
    htmlButton.css('visibility', 'visible')
    htmlButton.fadeTo(500, 0, function () {
      htmlButton.css('visibility', 'hidden')
    }) // duration, opacity, callback
  }

  /**
   * Things to do when data save was successful
   */
  this.onSuccessfulSave = function () {
    var htmlButton = $('#saveInfo')
    htmlButton.attr('value', 'Successfully saved!')
    htmlButton.css('background-color', '#00ff00')
  }

  /**
   * Things to do when data save was NOT successful
   */
  this.onErrorSave = function () {
    var htmlButton = $('#saveInfo')
    htmlButton.attr('value', 'Data NOT saved!')
    htmlButton.css('background-color', '#ff1100')
    errs.msg('Attention', 'Cannot save null values. Remember to set names appropriately')
  }

  /**
   * Asks user if really wants to exit app
   * @param msg message to show user
   * @param onSuccess function to execute iff user really wants out
   */
  this.confirmExitAndExecute = function (msg, onSuccess) {
    var hasChanged = DB.get('change', true)
    if (!hasChanged) {
      onSuccess()
      return
    }

    var userWantsOut = ops.exitApp(msg)

    if (userWantsOut) {
      onSuccess()
    }
  }

  /**
   * create label's editing popup
   */
  this.createTextInsert = function (msg) {
    $('#name-label').attr('placeholder', msg)
    $('#name-label-window').show()
    $('body').css({'overflow': 'hidden'})
    $('.delete').hide()
  }

  // utils

  /**
   * Counts how many data-fields are in editor
   * @returns {number}
   */
  this.countCurrentDataFields = function () {
    return document.getElementById('dataField').childElementCount
  }

  /**
   * @return id of element currently edited
   */
  this.currentlyEditedElementId = function () {
    return document.getElementById('idEntity').value
  }

  // populate

  /**
   * Sets name to current label
   */
  this.setCurrentLabelName = function () {
    var newName = DB.get('label', '')
    DB.set('change', true)
    CURRENT_LABEL.model.label(0, {
      position: 0.5,
      attrs: {
        rect: {fill: 'white'},
        text: {text: newName}
      }
    })  // sets label name
    CURRENT_LABEL.model.attr('text/text', newName)  // set internal state
  }

  /**
   * Adds new HTML data field to editor
   * @param maxNumber {int} max number of data fields allowed
   * @param errorMsg {string} error message to display when user tries to add more data field than allowed
   * @param dfCreator {func} function that create the HTML part of the data field
   * @returns {*} id of the new data field
   */
  this.addNewEmptyDataField = function (maxNumber, errorMsg, dfCreator) {
    if (maxNumber < 1) {
      errs.msg('Attention', errorMsg)
      return null
    }
    var df = dfCreator()
    var id = df.getAttribute('id')
    document.getElementById('dataField').appendChild(df)
    this.setupDataFieldButtons(id)
    return id
  }

  // setup

  /**
   * Opens description editor and populates with cell data
   * @param cell {joint cell} canvas cell
   */
  this.openDescriptionOfCell = function (cell) {
    try {
      var canvasCell = new Cell(cell)
      if (canvasCell.isModel()) {
        $('#closeEditor').click() // trigger close description
        LAST_EDITED_CELL = cell

        var id = cell.model.id
        var modelCell = cmd.getEntityById(id)
        self.showDataFieldDescription(canvasCell.getFullCellType(), id, canvasCell.getCellName())
        if (canvasCell.isEntity()) {
          self.showEntityData(modelCell)
        } else if (canvasCell.isControl()) {
          self.showControlData()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Manage entity Description's events
   */
  this.entityDescriptionManager = function () {

    /**
     * Contains dataFields main operations
     */
    this.dataFieldOperations = function () {
      $('#openDescription').on('click', function () {
        self.reopenDescriptionEditor()
      })

      $('#saveEntityEditor').on('click', function () {
        self.onAttemptSave()
        var saved = ops.saveDataFields()
        if (saved) {
          self.onSuccessfulSave()
        } else {
          self.onErrorSave()
        }
      })

      $('#saveControlEditor').on('click', function () {
        var closeButton = $('#closeEditor')
        closeButton.unbind() // prevent reuse until save is complete

        self.onAttemptSave()
        var id = self.currentlyEditedElementId()
        var newControl = ops.getControlData() // save in memory before purge
        var oldControl = DB.getFromArray('controls', 'id', self.currentlyEditedElementId())
        var saved = false

        if (newControl) {
          // update labels (from db)
          for (var i = 0; i < newControl["sub"].length; i++) {
            try {
              var linkId = oldControl['sub'][i]['linkId'] // get id from db
              var link = getCanvasCellById(linkId)
              newControl['sub'][i]['link'] = link.attr('text/text') // get name from view
            } catch (error) {
            }
          }

          saved = ops.removeSubControlFromScreen(id) // clear view
          if (saved) {
            DB.removeFromArray('controls', 'id', id) // remove old
            DB.appendToArray('controls', newControl) // add new
            saved = saved && self.updateControlData(id) // update view
          }
        }

        closeButton.on('click', self.closeEditor)

        if (saved) {
          self.onSuccessfulSave()
        } else {
          self.onErrorSave()
        }
      })

      $('#closeEditor').on('click', self.closeEditor)

      var addEntityButton = $('#plusEntity')
      addEntityButton.on('click', function () {
        self.addNewEmptyDataFieldForEntity()
      })

      var addControlButton = $('#plusControl')
      addControlButton.on('click', function () {
        self.addNewEmptyDataFieldForControl()
      })
    }

    /**
     * Shows entities' description
     * */
    this.showDescription = function () {
      PAPER.on('cell:pointerdblclick', function (cell) {
        if (cell.model.attr('type/text') !== 's') { // avoid sub-controls
          self.openDescriptionOfCell(cell)
        }
      })
    }

    this.dataFieldOperations()
    this.showDescription()
  }

  /**
   * Manage element's links' events
   */
  this.linkManager = function () {

    /**
     * opens links' label editor when double click on it
     */
    this.showLabelsEditor = function () {
      PAPER.on('link:pointerdblclick', function (cellView) {
        if (cellView.model.isLink()) {
          CURRENT_LABEL = cellView
          try {
            var currentLabelName = cellView.model.attr('text/text')
            if (currentLabelName.length > 0) {
              document.getElementById('name-label').value = currentLabelName
            }
          } catch (error) {
          }

          var editor = new LabelsEditorButtonManager()
          editor.setup(isValidLabelName, self.setCurrentLabelName, true)
          self.createTextInsert('Insert label\'s name')
        }
      })
    }

    /**
     * Checks if link is between a sub-controller
     * @param linkView {joint link view} link
     */
    this.isLinkBetweenSubControl = function (linkView) {
      try {
        var target = linkView.model.target()
        var cellTarget = getCanvasCellById(target.id)
        var targetType = cellTarget.attr('type/text')
        return targetType === 's'
      } catch (error) {
        return false
      }
    }

    /**
     * Handles links' tools' events
     */
    this.toolsManager = function () {
      // add tools(remove,arrows,links movements,boundaries) to links
      PAPER.on('link:mouseenter', function (linkView) {
        if (self.isLinkBetweenSubControl(linkView)) {
          linkView.addTools(ops.getLinkTools())
        } else {
          linkView.addTools(ops.getFullLinkTools())
        }
      })

      // hide tools on leaving from links area
      PAPER.on('link:mouseleave', function (linkView) {
        linkView.hideTools()
      })
    }

    this.showLabelsEditor()
    this.toolsManager()
  }

  /**
   * Manage element's events
   */
  this.elementsViewManager = function () {
    // tracking of selected and previous selected elements
    var selectedEl = null// current selected element
    var previousEl = null// previous selected element

    /**
     * Handles element selection and events related to it
     */
    this.elementSelector = function () {
      // set selectedEl
      PAPER.on('cell:pointerdown', function (cellView) {
        if (!cellView.model.isLink()) {
          selectedEl = cellView.model
        }
      })
      // change selectedEl to the current element and set it as previousEl
      PAPER.on({
        'element:pointerdown': function (elementView) {
          elementView.highlight()

          if (elementView !== previousEl && previousEl !== null) {
            previousEl.unhighlight()
          }
          previousEl = elementView
        }
      })
      // unselect all elements when click on canvas' blank spaces
      PAPER.on('blank:pointerclick', function () {
        if (previousEl !== null) {
          previousEl.unhighlight()
        }
        selectedEl = null
        previousEl = null
      })
    }

    this.elementSelector()
  }

  /**
   * Creates event clickers to reset, save, open and generate
   */
  this.editorButtonsManager = function () {
    $('#reset').on('click', function () {
      self.confirmExitAndExecute(ON_RESET_MSG, function () {
        cmd.clearAll()  // Delete all elements in GRAPH
        cmd.resetDataField() // Delete all data field
        $('#entityDescription').hide()
      })
    })

    // Generate json to download
    $('#save').on('click', function () {
      $('#closeEditor').click() // close description editor
      if (ops.saveFile()) {
        DB.set('change', false)
        return
      }
      errs.msg('Error while saving', 'Please try again.')
    })

    // open a file
    var openFileButton = $('#open')
    openFileButton.unbind() // remove previous listeners
    openFileButton.on('click', function () {
      self.confirmExitAndExecute(ON_CLOSE_MSG, function () {
        DB.clear()
        openFile()
      })
    })

    // Close this project
    $('#close').on('click', function () {
      self.confirmExitAndExecute(ON_CLOSE_MSG, function () {
        goToPage('/')
      })
    })

    // post codegen
    $('#generate').on('click', function () {
      TIMER_DEBUG.push({
        'createAt': Date.now()
      })

      var allJson = cmd.generateJSON()
      var entities = allJson['data']['entities']
      var dataToSend = JSON.stringify({
        'data': entities
      })

      var req = new XMLHttpRequest()
      req.open('POST', '/codegen', true)
      req.onreadystatechange = cmd.handleCodegenResponse
      req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8') // enable json
      req.send(dataToSend)

      TIMER_DEBUG[TIMER_DEBUG.length - 1]['sentAt'] = Date.now()
    })
  }

  /**
   * Shows data field editor + description
   * @param selection type of cell to show
   * @param id id of cell
   * @param name name of cell
   */
  this.showDataFieldDescription = function (selection, id, name) {
    $('#entityDescription').show()

    $('#plusEntity').hide() // add buttons
    $('#plusControl').hide()

    $('#saveEntityEditor').show() // save buttons
    $('#saveControlEditor').hide()

    $('#selectionName').html(selection)
    document.getElementById('idEntity').value = id
    document.getElementById('entity-label').value = name

    try {
      jumpTo('entityDescription')
      highlightImage(LAST_EDITED_CELL.model.id)
    } catch (error) {
    }

  }

  /**
   * Closes editor and trigger open of last cell
   */
  this.reopenDescriptionEditor = function () {
    try {
      if (LAST_EDITED_CELL !== null) {
        this.openDescriptionOfCell(LAST_EDITED_CELL)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // entity

  /**
   * Creates new HTML data field for entity
   */
  this.createNewEmptyDataFieldForEntity = function () {
    var newId = guid()
    var df = document.createElement('div')
    df.setAttribute('id', '' + newId)
    df.setAttribute('class', 'data-content form-group form-inline parent-center')

    var removeButton = document.createElement('button')
    removeButton.setAttribute('class', 'btn btn-secondary removalButton')
    removeButton.setAttribute('id', 'removeButtonDf' + newId)
    removeButton.setAttribute('type', 'button')
    var removeButtonText = document.createTextNode('Remove attribute')
    removeButton.appendChild(removeButtonText)
    df.appendChild(removeButton)

    var type = document.createElement('label')
    type.setAttribute('class', 'label center')
    var typeText = document.createTextNode('Type:')
    type.appendChild(typeText)
    df.appendChild(type)

    var typeSelect = document.createElement('select')
    typeSelect.setAttribute('class', 'form-control center')
    typeSelect.setAttribute('id', 'typeDf' + newId)

    var typeOption1 = document.createElement('option')
    var type1 = document.createTextNode('INT')
    typeOption1.appendChild(type1)
    typeSelect.appendChild(typeOption1)

    var typeOption2 = document.createElement('option')
    var type2 = document.createTextNode('DOUBLE')
    typeOption2.appendChild(type2)
    typeSelect.appendChild(typeOption2)

    var typeOption3 = document.createElement('option')
    var type3 = document.createTextNode('CHAR')
    typeOption3.appendChild(type3)
    typeSelect.appendChild(typeOption3)

    var typeOption4 = document.createElement('option')
    var type4 = document.createTextNode('STRING')
    typeOption4.appendChild(type4)
    typeSelect.appendChild(typeOption4)

    var typeOption5 = document.createElement('option')
    var type5 = document.createTextNode('BOOL')
    typeOption5.appendChild(type5)
    typeSelect.appendChild(typeOption5)

    var typeOption6 = document.createElement('option')
    var type6 = document.createTextNode('SHORT')
    typeOption6.appendChild(type6)
    typeSelect.appendChild(typeOption6)

    var typeOption7 = document.createElement('option')
    var type7 = document.createTextNode('BYTE')
    typeOption7.appendChild(type7)
    typeSelect.appendChild(typeOption7)

    var typeOption8 = document.createElement('option')
    var type8 = document.createTextNode('LONG')
    typeOption8.appendChild(type8)
    typeSelect.appendChild(typeOption8)

    var typeOption9 = document.createElement('option')
    var type9 = document.createTextNode('FLOAT')
    typeOption9.appendChild(type9)
    typeSelect.appendChild(typeOption9)

    var typeOption10 = document.createElement('option')
    var type10 = document.createTextNode('DECIMAL')
    typeOption10.appendChild(type10)
    typeSelect.appendChild(typeOption10)

    var typeOption11 = document.createElement('option')
    var type11 = document.createTextNode('DATE')
    typeOption11.appendChild(type11)
    typeSelect.appendChild(typeOption11)

    df.appendChild(typeSelect)

    var nameLabel = document.createElement('label')
    nameLabel.setAttribute('id', 'textNameDf' + newId)
    nameLabel.setAttribute('class', 'label center')
    var nomeText = document.createTextNode(' Name:')
    nameLabel.appendChild(nomeText)
    df.appendChild(nameLabel)

    var nameInput = document.createElement('input')
    nameInput.setAttribute('id', 'nameDf' + newId)
    nameInput.setAttribute('class', 'form-control center')
    nameInput.type = 'text'
    nameInput.maxLength = MAX_INPUT_LENGTH
    df.appendChild(nameInput)

    var primaryKeyButton = document.createElement('button')
    primaryKeyButton.setAttribute('class', 'btn twoStatesBtn center')
    primaryKeyButton.setAttribute('id', 'primaryKeyButtonDf' + newId)
    primaryKeyButton.setAttribute('type', 'button')
    var primaryKeyButtonText = document.createTextNode('Primary key')
    primaryKeyButton.appendChild(primaryKeyButtonText)
    df.appendChild(primaryKeyButton)

    var notNullButton = document.createElement('button')
    notNullButton.setAttribute('class', 'btn twoStatesBtn center')
    notNullButton.setAttribute('id', 'notNullButtonDf' + newId)
    notNullButton.setAttribute('type', 'button')
    var notNullButtonText = document.createTextNode('NOT NULL')
    notNullButton.appendChild(notNullButtonText)
    df.appendChild(notNullButton)

    return df
  }

  /**
   * Setups button behaviour of data field
   * @param id id of new data field
   */
  this.setupDataFieldButtons = function (id) {
    // set behaviour of buttons
    try {
      $('#primaryKeyButtonDf' + id).on('click', function (evt) {
        new TwoStateButton($(this)).toggle()
      })
    } catch (error) {
    }

    try {
      $('#notNullButtonDf' + id).on('click', function (evt) {
        new TwoStateButton($(this)).toggle()
      })
    } catch (error) {
    }

    try {
      $('#removeButtonDf' + id).on('click', function (evt) {
        var df = document.getElementById('' + id)
        if (df !== null) {
          df.remove() // this data-field has to be removed
        }
      })
    } catch (error) {
    }
  }

  /**
   * Adds new HTML data field to entity editor
   */
  this.addNewEmptyDataFieldForEntity = function () {
    return this.addNewEmptyDataField(
      MAX_DATA_FIELDS,
      'You have reached the maximum number data fields!',
      this.createNewEmptyDataFieldForEntity
    )
  }

  /**
   * Populates entity data area with data of entity
   * @param entity {obj} entity to show
   */
  this.populateEntityData = function (entity) {
    $('#entity-package').show()
    document.getElementById('entity-package').value = entity['package']
    $('#entity-package-label').show()

    if (entity.dataFields !== null) {
      entity.dataFields.forEach(function (df) {
        var dfId = self.addNewEmptyDataFieldForEntity()  // trigger addition of new Df
        document.getElementById('typeDf' + dfId).value = df['fieldType']
        document.getElementById('nameDf' + dfId).value = df['fieldName']
        new TwoStateButton($('#primaryKeyButtonDf' + dfId)).setState(df['primaryK'])
        new TwoStateButton($('#notNullButtonDf' + dfId)).setState(df['notNull'])
      })
    }
  }

  /**
   * Loads inner data of entity in entity box
   * @param entity {Object} entity
   */
  this.showEntityData = function (entity) {
    try {
      $('#plusEntity').show()
      $('#plusControl').hide()

      $('#saveEntityEditor').show()
      $('#saveControlEditor').hide()

      cmd.resetDataField()
      this.populateEntityData(entity)
    } catch (error) {
    }
  }

  // controller

  /**
   * Creates new HTML data field control
   */
  this.createNewEmptyDataFieldForControl = function () {
    var newId = guid()
    var df = document.createElement('div')
    df.setAttribute('id', '' + newId)
    df.setAttribute('class', 'data-content form-group form-inline parent-center')

    var removeButton = document.createElement('button')
    removeButton.setAttribute('class', 'btn btn-secondary removalButton')
    removeButton.setAttribute('id', 'removeButtonDf' + newId)
    removeButton.setAttribute('type', 'button')
    var removeButtonText = document.createTextNode('Remove control')
    removeButton.appendChild(removeButtonText)
    df.appendChild(removeButton)

    var nameLabel = document.createElement('label')
    nameLabel.setAttribute('id', 'textNameDf' + newId)
    nameLabel.setAttribute('class', 'label center')
    var nomeText = document.createTextNode(' Name:')
    nameLabel.appendChild(nomeText)
    df.appendChild(nameLabel)

    var nameInput = document.createElement('input')
    nameInput.setAttribute('id', 'nameDf' + newId)
    nameInput.setAttribute('class', 'form-control center')
    nameInput.type = 'text'
    nameInput.maxLength = MAX_INPUT_LENGTH
    df.appendChild(nameInput)

    return df
  }

  /**
   * Adds new HTML data field to control editor
   */
  this.addNewEmptyDataFieldForControl = function () {
    return this.addNewEmptyDataField(
      MAX_SUB_CONTROLLERS - self.countCurrentDataFields(),
      'You have reached the maximum number of controls!',
      this.createNewEmptyDataFieldForControl
    )
  }

  /**
   * Updates data about control
   * @param id {string} id of control to update
   */
  this.updateControlData = function (id) {
    try {
      var main = DB.getFromArray('controls', 'id', id, null)
      var mainControl = getCanvasCellById(id)
      var mainPosition = mainControl.position() // in reference to canvas
      var xPosition = mainPosition['x'] - 200
      var deltaXPosition = (mainPosition['x'] + 200 - xPosition) / main['sub'].length

      var subs = main['sub']
      if (subs !== null) {
        for (var i = 0; i < subs.length; i++) {
          var sub = subs[i]
          elementsHandler.createSubControl() // trigger new control in canvas
          var cell = GRAPH.getLastCell()
          var controlId = cell.id // id of just-created control
          sub['id'] = controlId // used to remove element afterwards

          var newPosition = validatePositionToCanvas({
            'x': xPosition,
            'y': mainPosition['y'] + 200
          }, CANVAS_OFFSET)

          cell.position(newPosition['x'], newPosition['y']) // move accordingly
          cell.attr('text/text', sub['name']) // set name
          cell.attr('./display', 'block') // show

          if (sub['link']) { // add link
            var link = new joint.shapes.devs.LinkWithCaption() // create link
            link.source({'id': id, port: ''})  // from main control
            link.target({'id': controlId, port: ''}) // to sub control
            link.attr('text/text', sub['link']) // set name of link
            link.addTo(GRAPH) // show
            sub['linkId'] = link.id // link reference
          }

          xPosition += deltaXPosition // space elements
          subs[i] = sub // update db
        }
      }
      main['sub'] = subs
      DB.removeFromArray('controls', 'id', id) // purge from db
      DB.appendToArray('controls', main) // load new data

      mainControl.attr('text/text', main['name']) // update name
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  /**
   * Populates control data area with data of control
   * @param id {string} id of control to show
   */
  this.populateControlData = function (id) {
    this.updateControlData(id) // update graph

    try {
      var main = DB.getFromArray('controls', 'id', id, null)
      var subs = main['sub']
      if (subs !== null) {
        subs.forEach(function (sub) {
          // update editor
          var dfId = self.addNewEmptyDataFieldForControl()  // trigger addition of new Df
          document.getElementById('nameDf' + dfId).value = sub['name']
        })
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Shows data about control
   */
  this.showControlData = function () {
    try {
      $('#plusEntity').hide()
      $('#plusControl').show()

      $('#saveEntityEditor').hide()
      $('#saveControlEditor').show()

      cmd.resetDataField()
      this.populateControlData(self.currentlyEditedElementId())
    } catch (error) {
    }
  }

  /**
   * Setups manager events and functions
   */
  this.setup = function () {
    this.editorButtonsManager()
    this.entityDescriptionManager()
    this.elementsViewManager()
    this.linkManager()
  }
}

function loadEventsEditor () {
  var manager = new EditorEventsManager()
  manager.setup()

  DB.set('userWantsOut', false)
}
