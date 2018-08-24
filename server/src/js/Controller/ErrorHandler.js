/**
 * Handles errors boxes
 */
function ErrorHandler () {
  /**
   * Checks if there is already a error box
   * @return {boolean} true iff there is already a error box
   */
  this.isThereAlreadyAError = function () {
    var errContent = document.getElementById('error-text')
    return !!errContent
  }

  /**
   * Uses last error box to show new message
   * @param contentTitle {string} title of message
   * @param contentMsg {string} content of message
   */
  this.usePreviousMessageBox = function (contentTitle, contentMsg) {
    var errBox = document.getElementById('error-msg-content')
    errBox.children[0].innerHTML = contentTitle
    errBox.children[1].innerHTML = contentMsg
  }

  /**
   * Creates a error box with message
   * @param contentTitle {string} title of message
   * @param contentMsg {string} content of message
   * @return {Element} contains error box
   */
  this.createErrorBox = function (contentTitle, contentMsg) {
    var content = document.createElement('div')
    content.setAttribute('id', 'error-msg-content')

    var textTitle = document.createElement('h3')
    var title = document.createTextNode(contentTitle)
    textTitle.appendChild(title)
    content.appendChild(textTitle)

    var textMsg = document.createElement('p')
    textMsg.setAttribute('id', 'error-text')
    var message = document.createTextNode(contentMsg)
    textMsg.appendChild(message)
    content.appendChild(textMsg)

    var button = document.createElement('button')
    button.setAttribute('class', 'btn btn-outline-secondary')
    button.setAttribute('id', 'error-ok')
    var buttonText = document.createTextNode('OK')
    button.appendChild(buttonText)
    content.appendChild(button)

    // close error message (all type of message)
    button.addEventListener('click', function () {
      $('#error-msg').hide()
      document.getElementById('error-msg-content').remove() // remove errors
      $('body').css({'overflow-y': 'scroll'})
      $('.delete').show()
    })

    return content
  }

  /**
   * It is the function that is used to show any type of message (error or not)
   * @param contentTitle {string} title of message
   * @param contentMsg {string} content of message
   */
  this.msg = function (contentTitle, contentMsg) {
    if (this.isThereAlreadyAError()) {
      console.log('using previous ...')
      this.usePreviousMessageBox(contentTitle, contentMsg)
      return
    }

    var box = this.createErrorBox(contentTitle, contentMsg)
    document.getElementById('error-msg').appendChild(box)
    $('body').css({'overflow': 'hidden'})
    $('.delete').hide()
    $('#error-msg').show()
  }
}
