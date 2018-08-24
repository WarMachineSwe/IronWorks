var errs = new ErrorHandler()

/**
 * Parses event and loads data to db
 * @param evt event
 */
function loadJsonToDb (evt) {
  var parts = evt.target.result.split('\n')
  var data = JSON.parse(parts[2])['data']
  DB.set('graph', JSON.parse(parts[0]))
  DB.set('entities', data['entities'])
  DB.set('controls', data['controls'])
  DB.set('change', false)
}

/**
 * Gets name of file involved in event
 * @param evt event
 * @param extension {string} extension of file
 * @return {string} name of file in event
 */
function getFileNameFromEvent (evt, extension) {
  var name = evt.target.files[0]['name']
  var tokens = name.split('.' + extension)
  return tokens[0]
}

/**
 * Reads JSON file
 * @param evt event holding file
 */
function readJsonFileHP (evt) {
  var file = evt.target.files[0]
  var fileName = getFileNameFromEvent(evt, 'json')

  if (file) {
    var reader = new FileReader()
    reader.onload = function (evt) {
      //return "part2"
      if (!validateFileInput(evt)) {
        errs.msg('Error', 'Cannot parse your input file: hash doesn\'t match')
        return false
      }

      DB.set('outFile', fileName)
      loadJsonToDb(evt)
      location.href = 'app.html'
    }
      reader.readAsText(file)
  }
    return false
}

/**
 * Opens a file dialog and loads file to app
 */
function openFile () {
  document.getElementById('get_file').click()
  document.getElementById('get_file').addEventListener('change', readJsonFileHP, false)
}

/**
 * Setups events listeners
 */
function setup () {
  $('#open').on('click', function () {
    openFile()
  })

  $('#error-ok').on('click', function () {
    $('#error-msg').hide()
    $('body').css({'overflow-y': 'scroll'})
    $('.delete').show()
  })
}

setup()
