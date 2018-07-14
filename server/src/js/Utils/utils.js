/**
 * Downloads text
 * @param text {string} text to download
 * @param filename {string} to save
 */
function downloadText (text, filename) {
  var myText = text.split('\n')
  myText[0] += '\n' + CryptoJS.SHA512(myText[0])
  myText[1] += '\n' + CryptoJS.SHA512(myText[1])
  text = myText[0] + '\n' + myText[1]
  download(text, filename, 'text/plain')
}

/**
 * Handles codegen response
 */
function handleCodegenResponse () {
  var response = new ServerResponse(this)
  if (response.hasCompleted()) {
    if (response.isSuccessful()) {
      download(response.getData(), response.getFilename(), 'text/plain')
    } else {
     console.log(response.getError())
    }
  }
}
