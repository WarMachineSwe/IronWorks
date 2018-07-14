var graph = createGraph() // creates graph, then add objects
var paper = createCanvas() // canvas to host objects
var db = new LocalStorageFacade() // local storage driver
db.set('entities', []) // initialize 'entities' in localstorage

// var to balance the data fields of each entity
var indexDF = 0
var dim = 20

// function to delete all data field
function resetDataField () {
  var counter = 0
  // console.log(indexDF)
  // console.log( document.getElementById(''+ counter))
  while (counter < indexDF) {
    document.getElementById('' + counter).remove()
    counter++
  }
}

// EDIT: the entities will be selected using the id of the cells in the graph
// todo NON RIMUOVERE, E' IL SAMPLE PER IL LOCALSTORAGE
/* var canvas = [
  {
    entityId: ' ',
    entityName: '',
    entityScope: '',
    dataFields: [{
      fieldScope: '',
      fieldName: '',
      fieldType: ''
    }]
  }
] */

//setCreateOnClick()
setOpsOnClick()
setSaveDelOnClick()

// load json
$(window).on('load', function () {
  if (db.get('file')) {
    var json = JSON.parse(db.get('file'))
    if (db.get('code')) {
      var entityUploaded = JSON.parse(db.get('code'))
      db.set('entities', entityUploaded)
    }
    displayContents(json)
    db.remove('file')
    db.remove('code')
  }
})

// open box on double click over entity
paper.on('cell:pointerdblclick', function (cell) {
  if (cell.model.attr('type/text') === 'e') {
    $('#descrizioneEntity').show()
    showEntityData(searchIdByCell(cell))
  }
})

// clicking the button "salva" the method updates the local storage
$('#salvaDF').on('click', function () {
  // add a new record of the entity at the bottom of the array
  var aux = db.get('entities')
  var idToRemove = searchIndexById(document.getElementById('idEntity').value)
  // save the data of any data field created in a var to be copied in the local storage
  var counter = 0
  // count the valid attributes element
  var countDF = 0
  var tmpDF = []

  while (counter < indexDF) {
    // check either the attributes of counter index was removed or not
    if (document.getElementById('' + counter) !== null) {
        //console.log(document.getElementById('primaryDF' + counter).checked)
      tmpDF[countDF] = {fieldScope: '', fieldType: '', fieldName: '', primaryK: ''}
      tmpDF[countDF].fieldScope = document.getElementById('scopeDF' + counter).value
      tmpDF[countDF].fieldType = document.getElementById('tipoDF' + counter).value
      tmpDF[countDF].fieldName = document.getElementById('nameDF' + counter).value
      tmpDF[countDF].primaryK = document.getElementById('primaryDF' + counter).checked
      countDF++
    }
    counter++
  }

  aux.push({
    'entityId': document.getElementById('idEntity').value,
    'entityName': aux[idToRemove].entityName,
    'entityScope': document.getElementById('scopeEntity').value,
    'dataFields': tmpDF
  })
  // search the index to the previous entity cell in the local storage array to remove
  aux.splice(idToRemove, 1)
  // update the local storage with the new data of the entity
  db.set('entities', aux)
  // console.log(db.get('entities'))
  //console.log(generateJSON())
    savedDF()
})

//Show a box and said that saving has gone well
function savedDF(){
    $('#error-msg-content').find('> h3').html('Successfully saved')
    $('#error-msg-content').find('> p').html('You have save your information about this entity.')
    $('body').css({'overflow': 'hidden'})
    $('.delete').hide()
    $('#error-msg').show()
}


// hide the entity box and doesn't keep the updated data
$('#annullaDF').on('click', function () {
  $('#descrizioneEntity').hide()
})

// function to delete any data fields selected through the checkbox
$('#minus').on('click', function () {
  var counter = 0
  var elementToRemove = 0 // number of elements to remove

  while (counter < indexDF) {
    if (document.getElementById('' + counter) !== null) {
      if (document.getElementById('checkbox' + counter).checked === true) {
        // update of the local storage obj
        var aux = db.get('entities')
        document.getElementById('' + counter).remove()
        aux[searchIndexById(document.getElementById('idEntity').value)].dataFields.splice(counter - elementToRemove, 1)
        db.set('entities', aux)
        elementToRemove++
        //console.log(generateJSON())
      }
    }
    counter++
  }
})

$('#plus').on('click', function () {

    var nuovoDF = document.createElement('div')
    nuovoDF.setAttribute('id', '' + indexDF)
    nuovoDF.setAttribute('class', 'data-content form-group form-inline')

    var checkboxCanc = document.createElement('input')
    checkboxCanc.setAttribute('id', 'checkbox' + indexDF)
    checkboxCanc.setAttribute('class', 'form-check-input position-static')
    checkboxCanc.type = 'checkbox'
    nuovoDF.appendChild(checkboxCanc)

    var scope = document.createElement('label')
    scope.setAttribute('id', 'textScopeDF' + indexDF)
    scope.setAttribute('class', 'label')
    var scopeText = document.createTextNode('Scope:')
    scope.appendChild(scopeText)
    nuovoDF.appendChild(scope)

    var scopeSelect = document.createElement('select')
    scopeSelect.setAttribute('id', 'scopeDF' + indexDF)
    scopeSelect.setAttribute('class', 'form-control')

    var scopeOption1 = document.createElement('option')
    var scope1 = document.createTextNode('private')
    scopeOption1.appendChild(scope1)
    scopeSelect.appendChild(scopeOption1)

    var scopeOption2 = document.createElement('option')
    var scope2 = document.createTextNode('package')
    scopeOption2.appendChild(scope2)
    scopeSelect.appendChild(scopeOption2)

    var scopeOption3 = document.createElement('option')
    var scope3 = document.createTextNode('protected')
    scopeOption3.appendChild(scope3)
    scopeSelect.appendChild(scopeOption3)

    var scopeOption4 = document.createElement('option')
    var scope4 = document.createTextNode('public')
    scopeOption4.appendChild(scope4)
    scopeSelect.appendChild(scopeOption4)

    nuovoDF.appendChild(scopeSelect)

    var tipo = document.createElement('label')
    tipo.setAttribute('id', 'typeDF' + indexDF)
    tipo.setAttribute('class', 'label')
    var tipoText = document.createTextNode('Tipo:')
    tipo.appendChild(tipoText)
    nuovoDF.appendChild(tipo)

    var tipoSelect = document.createElement('select')
    tipoSelect.setAttribute('class', 'form-control')
    tipoSelect.setAttribute('id', 'tipoDF' + indexDF)

    var tipoOption1 = document.createElement('option')
    var tipo1 = document.createTextNode('INT')
    tipoOption1.appendChild(tipo1)
    tipoSelect.appendChild(tipoOption1)

    var tipoOption2 = document.createElement('option')
    var tipo2 = document.createTextNode('DOUBLE')
    tipoOption2.appendChild(tipo2)
    tipoSelect.appendChild(tipoOption2)

    var tipoOption3 = document.createElement('option')
    var tipo3 = document.createTextNode('CHAR')
    tipoOption3.appendChild(tipo3)
    tipoSelect.appendChild(tipoOption3)

    var tipoOption4 = document.createElement('option')
    var tipo4 = document.createTextNode('STRING')
    tipoOption4.appendChild(tipo4)
    tipoSelect.appendChild(tipoOption4)

    var tipoOption5 = document.createElement('option')
    var tipo5 = document.createTextNode('BOOL')
    tipoOption5.appendChild(tipo5)
    tipoSelect.appendChild(tipoOption5)

    var tipoOption6 = document.createElement('option')
    var tipo6 = document.createTextNode('SHORT')
    tipoOption6.appendChild(tipo6)
    tipoSelect.appendChild(tipoOption6)

    var tipoOption7 = document.createElement('option')
    var tipo7 = document.createTextNode('BYTE')
    tipoOption7.appendChild(tipo7)
    tipoSelect.appendChild(tipoOption7)

    var tipoOption8 = document.createElement('option')
    var tipo8 = document.createTextNode('LONG')
    tipoOption8.appendChild(tipo8)
    tipoSelect.appendChild(tipoOption8)

    var tipoOption9 = document.createElement('option')
    var tipo9 = document.createTextNode('FLOAT')
    tipoOption9.appendChild(tipo9)
    tipoSelect.appendChild(tipoOption9)

    var tipoOption10 = document.createElement('option')
    var tipo10 = document.createTextNode('DECIMAL')
    tipoOption10.appendChild(tipo10)
    tipoSelect.appendChild(tipoOption10)

    var tipoOption11 = document.createElement('option')
    var tipo11 = document.createTextNode('DATE')
    tipoOption11.appendChild(tipo11)
    tipoSelect.appendChild(tipoOption11)

    nuovoDF.appendChild(tipoSelect)

    var nome = document.createElement('label')
    nome.setAttribute('id', 'textNameDF' + indexDF)
    nome.setAttribute('class', 'label')
    var nomeText = document.createTextNode(' Nome:')
    nome.appendChild(nomeText)
    nuovoDF.appendChild(nome)

    var nomeIn = document.createElement('input')
    nomeIn.setAttribute('id', 'nameDF' + indexDF)
    nomeIn.setAttribute('class', 'form-control')
    nomeIn.type = 'text'
    nuovoDF.appendChild(nomeIn)

    var primaryKey = document.createElement('label')
    primaryKey.setAttribute('class', 'label')
    primaryKey.setAttribute('id', 'primaryKeyDF' + indexDF)
    var primaryKeyText = document.createTextNode('Primary Key:')
    primaryKey.appendChild(primaryKeyText)
    nuovoDF.appendChild(primaryKey)

    var cb = document.createElement('input')
    cb.setAttribute('class', 'form-control')
    cb.setAttribute('id', 'primaryDF' + indexDF)
    cb.type = 'checkbox'
    nuovoDF.appendChild(cb)

    document.getElementById('dataField').appendChild(nuovoDF)

    indexDF++

    if (indexDF === 20) {
        dim = indexDF + 20
    }
    if (indexDF < dim && indexDF % 2 === 0) {
        $('#descrizioneEntity').css({'height': 20 + indexDF * 5 + 'em'})
    }
})

// todo splice(i,1) ogni volta che viene cliccata la x di un modello! EDIT: non usare pop o delete pop di tutto al reset
