var errs = new ErrorHandler()

function Commands () {
  /**
   * Clears canvas and DB
   */
  this.clearAll = function () {
    var projectName = DB.get('outFile', '')  // save project name
    GRAPH.clear()
    DB.reset()  // clear DB
    DB.set('projectName', projectName)
  }

  /**
   * Displays JSON parsed in diagram
   * @param json {string} JSON file
   */
  this.displayContents = function (json) {
    GRAPH.clear() // clear everything to be sure nothing is left behind
    GRAPH.fromJSON(json)
  }

  /**
   * Displays JSON parsed in diagram
   */
  this.loadJson = function (evt) {
    var parti = evt.target.result.split('\n')
    if (!validateFileInput(evt)) {
      errs.msg('Error', 'Cannot parse your input file: hashes don\'t match')
      return false
    }
    var jsonG = JSON.parse(parti[0])
    var entityUploaded = JSON.parse(parti[2])
    this.displayContents(jsonG)
    DB.set('entities', entityUploaded)
    DB.set('change', false)
  }

  /**
   * Read a file that is uploaded in DB .
   * It is used to open a file that is opened in index.
   *
   * Fetches JSON file
   * @param evt {event} Event holding file
   */
  this.readJsonFile = function (evt) {
    var file = evt.target.files[0]
    if (file) {
      var reader = new FileReader()
      var self = this  // trick to use this object in nested function
      reader.onload = function (evt) {
        self.loadJson(evt)
      }
      reader.readAsText(file)
    }
    return true
  }

  /**
   * Gets HTML array with data fields
   * @return {[]} [] of data fields
   */
  this.getRawDataFields = function () {
    try {
      return Array.from(document.getElementById('dataField').children)
    } catch (error) {
      return []
    }
  }

  /**
   * Gets data field from HTML page
   * @returns {Array} of data fields
   */
  this.getDataFields = function () {
    var out = []  // gets new data fields
    this.getRawDataFields().forEach(function (df) {  // parse html
      out.push(
        {
          'fieldType': document.getElementById('typeDf' + df.id).value,
          'fieldName': document.getElementById('nameDf' + df.id).value,
          'primaryK': new TwoStateButton($('#primaryKeyButtonDf' + df.id)).isActive(),
          'notNull': new TwoStateButton($('#notNullButtonDf' + df.id)).isActive()
        }
      )
    })

    return out
  }

  /**
   * Gets sub-controls from HTML page
   * @returns {Array} of controls
   */
  this.getSubControls = function () {
    try {
      var out = []
      this.getRawDataFields().forEach(function (df) {
        var name = document.getElementById('nameDf' + df.id).value
        out.push(
          {
            'name': name,
            'link': 'link name'
          }
        )
      })

      return out
    } catch (error) {
      return []
    }
  }

  /**
   * Executes a simple validation of data-fields of entity
   * @param newName {string} name of entity
   * @param newPackage {string} name of package
   * @param attributes {[]} entity attributes
   * @return {boolean} true iff names are valid
   */
  this.validateDataFields = function (newName, newPackage, attributes) {
    if (!(isValidLabelName(newName) && isValidLabelName(newPackage))) {
      return false
    }

    for (var i = 0; i < attributes.length; i++) {
      var name = attributes[i]['fieldName']
      if (!isValidLabelName(name)) {
        return false
      }
    }

    return true
  }

  /**
   * Executes a simple validation of control data
   * @param newName {string} name of entity
   * @param subControls {[]} entity sub controls
   * @return {boolean} true iff names are valid
   */
  this.validateControlData = function (newName, subControls) {
    if (!isValidLabelName(newName)) {
      return false
    }

    for (var i = 0; i < subControls.length; i++) {
      var name = subControls[i]['name']
      if (!isValidLabelName(name)) {
        return false
      }
    }

    return true
  }

  /**
   * You can save all data field of the entity that now has been opened.
   * All the information is put in DB.
   * */
  this.saveDataFields = function () {
    var id = document.getElementById('idEntity').value
    var cell = getCellById(id)
    var newName = document.getElementById('entity-label').value
    var newPackage = document.getElementById('entity-package').value

    if (!isValidLabelName(newName)) {
      return false
    }

    if (cell.isEntity()) {
      var attributes = this.getDataFields()
      if (!this.validateDataFields(newName, newPackage, attributes)) {
        return false
      }

      DB.removeFromArray('entities', 'entityId', id) // remove old
      DB.appendToArray('entities', {
        'entityId': id,  // same id
        'entityName': newName,
        'package': newPackage,
        'dataFields': attributes
      }) // add new
    }

    cell.setNewName(newName)
    return true
  }

  /**
   * Parses HTML to get data about control
   * @return {obj || false} control data
   */
  this.getControlData = function () {
    var id = document.getElementById('idEntity').value
    var newName = document.getElementById('entity-label').value
    var subControls = this.getSubControls()

    var oldControl = DB.getFromArray('controls', 'id', id)
    oldControl['name'] = newName
    oldControl['sub'] = subControls

    if (!this.validateControlData(newName, subControls)) {
      return false
    }

    return oldControl
  }

  /**
   * Generates custom JSON for server
   * @returns {{}} Entities and controls in app
   */
  this.generateJSON = function () {
    try {
      return {
        'data': {
          'entities': DB.get('entities', []),
          'controls': DB.get('controls', [])
        }
      }
    } catch (error) {
      return {}
    }
  }

  /**
   * Creates a backup of the current graph
   */
  this.getGraphBackup = function () {
    return GRAPH.toJSON()
  }

  /**
   * Creates a backup of the current entities
   */
  this.getDbBackup = function () {
    return this.generateJSON()
  }

  /**
   * Creates a backup of the current data
   */
  this.getBackup = function () {
    return JSON.stringify(this.getGraphBackup()) + '\n' + JSON.stringify(this.getDbBackup())
  }

  /**
   * Matches the entityID with the cell id clicked
   * @param cellId {string} Id of cell clicked by the user
   * @returns {number} the index of the cell of local storage array
   */
  this.getEntityById = function (cellId) {
    return DB.get('entities', []).find(function (element) {
      return element['entityId'] === cellId
    })
  }

  /**
   * Deletes all data field
   */
  this.resetDataField = function () {
    document.getElementById('entity-package').value = ''

    for (var i = 0; i < MAX_DATA_FIELDS; i++) {
      var df = document.getElementById('' + i)
      if (df !== null) {
        df.remove() // this data-field has to be removed
      }
    }
  }

  /**
   * Downloads text
   * @param text {string} text to download
   * @param filename {string} to save
   */
  this.downloadText = function (text, filename) {
    var myText = text.split('\n')
    myText[0] += '\n' + CryptoJS.SHA512(myText[0])
    myText[1] += '\n' + CryptoJS.SHA512(myText[1])
    text = myText[0] + '\n' + myText[1]
    download(text, filename, 'text/plain')
  }

  /**
   * Handles codegen response
   */
  this.handleCodegenResponse = function () {
    TIMER_DEBUG[TIMER_DEBUG.length - 1]['receivedAt'] = Date.now()

    var response = new ServerResponse(this)
    if (response.hasCompleted()) {
      if (response.isSuccessful()) {
        download(response.getData(), response.getFilename('tar'), 'text/plain')
      } else {
        var error = response.getError()
        errs.msg(error['title'], error['message'])
      }
    }

    TIMER_DEBUG[TIMER_DEBUG.length - 1]['processedAt'] = Date.now()
  }

  /**
   * Creates simple list with tools to edit links
   * @return {[null,null,null,null]}
   */
  this.createToolsList = function () {
    var sourceArrowheadTool = new joint.linkTools.SourceArrowhead()
    var targetArrowheadTool = new joint.linkTools.TargetArrowhead()
    var boundaryTool = new joint.linkTools.Boundary()
    var infoButton = new joint.linkTools.InfoButton()
    return [
      sourceArrowheadTool, targetArrowheadTool,
      boundaryTool, /*removeButton,*/ infoButton
    ]
  }

  /**
   * Creates link tools for robustness model
   * @return tools
   */
  this.createTools = function () {
    return new joint.dia.ToolsView({
      tools: this.createToolsList()
    })
  }

  /**
   * Creates full link tools for robustness model
   * @return tools
   */
  this.createFullTools = function () {
    var removeButton = new joint.linkTools.Remove()
    var basicTools = this.createToolsList()
    basicTools.push(removeButton)

    return new joint.dia.ToolsView({
      tools: basicTools
    })
  }

  /**
   * Read a file that is uploaded in DB .
   * It is used to open a file that is opened in homepage.
   * */
  this.loadJsonFromDb = function () {
    try {
      var json = DB.get('graph', {})
      DB.remove('graph') // clean
      this.displayContents(json)
    } catch (error) {
    }
  }
}
