/**
 * Reads JSON file
 * @param evt event holding file
 */
function readJsonFileHP (evt) {
  var file = evt.target.files[0]
  if (file) {
    var reader = new FileReader()
    reader.onload = function (evt) {
      var parti = evt.target.result.split('\n')
      if (CryptoJS.SHA512(parti[0]) != parti[1] || CryptoJS.SHA512(parti[2]) != parti[3]) {
        $('body').css({'overflow': 'hidden'})
        $('.delete').hide()
        $('#error-msg').show()
        return
      }
      var json = JSON.stringify(parti[0])
      var code = JSON.stringify(parti[2])
      localStorage.setItem('file', json)
      localStorage.setItem('code', code)
      location.href = 'app.html'
    }
  }
  reader.readAsText(file)
}

$('#open').on('click', function () {
  document.getElementById('get_file').click()
  document.getElementById('get_file').addEventListener('change', readJsonFileHP, false)
})

$('#error-ok').on('click', function () {
  $('#error-msg').hide()
  $('body').css({'overflow-y': 'scroll'})
  $('.delete').show()
})
