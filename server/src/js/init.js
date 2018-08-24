const VERSION = '6.6.4 (ecfd507357f7f7b41512b649344432a3b03c68df at 16:32:13 18-08-21 +0200)'

/**
 * Prints to screen and logs in console current version
 */
function logVersion () {
  try {
    document.getElementById('version').innerHTML = VERSION
  } catch (error) {
  }
  console.log(VERSION)
}

logVersion()
