//var db = new LocalStorageFacade() // local storage driver

/**
 * Fetches JSON file
 * @param evt {event} Event holding file
 */
function readJsonFile (evt) {
    var file = evt.target.files[0]
    if (file) {
        var reader = new FileReader()
        reader.onload = function (evt) {
            var parti = evt.target.result.split('\n')

            if (CryptoJS.SHA512(parti[0]) != parti[1] || CryptoJS.SHA512(parti[2]) != parti[3]) {
                $('#error-msg-content').find('> h3').html('Wrong file')
                $('#error-msg-content').find('> p').html('You have uploaded a wrong file.')
                $('body').css({'overflow': 'hidden'})
                $('.delete').hide()
                $('#error-msg').show()
                return
            }
            var jsonG = JSON.parse(parti[0])
            var entityUploaded = JSON.parse(parti[2])

            displayContents(jsonG)
            db.set('entities', entityUploaded)
        }
        reader.readAsText(file)
    }
}

/**
 * Displays JSON parsed in diagram
 * @param json {string} JSON file
 */
function displayContents (json) {
  graph.clear() // pulizia preventiva per evitare che rimangano elementi html in canvas
  graph.fromJSON(json)
}

/**
 * Generates custom JSON for server
 * @returns {Array} List of attributes of entitites
 */
function generateJSON () {
  var entities = [] // obj to send that cointains all attribute of entities
    var length = 0
    if(db.get('entities')) {
        length = db.get('entities').length
    }
  for (var i = 0; i < length; i++) {
    entities[i] = {
        'entityId' : db.get('entities')[i].entityId,
        'entityName': db.get('entities')[i].entityName,
        'entityScope': db.get('entities')[i].entityScope,
        'dataFields': db.get('entities')[i].dataFields
    }
  }

  return entities
}

/**
 * Loads inner data of entity in entity box
 * @param index {int} entity index
 */
function showEntityData (index) {
  resetDataField()
  var aux = db.get('entities') // parse result
  document.getElementById('idEntity').value = aux[index].entityId // todo cannot set property of null
  document.getElementById('nomeEntity').value = aux[index].entityName
  document.getElementById('scopeEntity').value = aux[index].entityScope

  if (aux[index].dataFields !== null) {
    indexDF = 0
    var counter = 0
    while (counter < aux[index].dataFields.length) {
      $('#plus').click()
      document.getElementById('scopeDF' + counter).value = aux[index].dataFields[counter].fieldScope
      document.getElementById('tipoDF' + counter).value = aux[index].dataFields[counter].fieldType
      document.getElementById('nameDF' + counter).value = aux[index].dataFields[counter].fieldName
      document.getElementById('primaryDF' + counter).checked = aux[index].dataFields[counter].primaryK

      counter++
    }

    indexDF = aux[index].dataFields.length
  } else {
    indexDF = 0
  }
}

/**
 * Matches the entityID with the cell id clicked
 * @param cell {joint.cell} cell clicked by the user
 * @returns {number} the index of the cell of local storage array
 */
function searchIdByCell (cell) {
  var counter = 0
  var aux = db.get('entities')
  while (cell.model.id !== aux[counter].entityId) {
    counter++
  }
  return counter
}

/**
 * Finds the index of the local storage array to update or delete
 * @param Id {int} id passed through the box
 * @returns {number} index of the cell of the local storage array which match the Id
 */
function searchIndexById (Id) {
  var counter = 0
  var aux = db.get('entities')
  while (Id !== aux[counter].entityId) {
    counter++
  }
  return counter
}
