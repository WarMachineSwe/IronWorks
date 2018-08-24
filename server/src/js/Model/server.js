/**
 * Models a response from the server
 * @param raw {XHTTMLResponse} Raw response from server
 */
function ServerResponse (raw) {
  this.raw = raw

  /**
   * Checks if response has completed
   * @returns {boolean} true iff response has completed
   */
  this.hasCompleted = function () {
    return this.raw.readyState === 4
  }

  /**
   * Checks if response is good
   * @returns {boolean} true iff not a server error
   */
  this.isGood = function () {
    return this.raw.status <500
  }

  /**
   * Checks if response is successful
   * @returns {boolean} true iff has completed and is good
   */
  this.isSuccessful = function () {
    return this.hasCompleted() && this.isGood()
  }

  /**
   * Gets response data
   * @returns {string} response data (text)
   */
  this.getData = function () {
    var rawResponse = this.raw.responseText
    try {
      rawResponse.split('\n') // check if there is some data
      return rawResponse
    } catch (error) {
      return '\n'
    }
  }

  /**
   * Creates a possible filename for the download of data
   * @returns {string} filename for the download of data
   */
  this.getFilename = function (extension) {
    return 'code-' + Date.now() + '.' + extension
  }

  /**
   * Gets response code
   * @returns {int} HTTP response status code
   */
  this.getCode = function () {
    return this.raw.status
  }

  /**
   * Gets error of response
   * @returns {{}} response error (if applicable)
   */
  this.getError = function () {
    //console.log(this.raw.responseText)
    var error = JSON.parse(this.raw.responseText)
    return {
      'title': error['title'],
      'message': error['message']
    }
  }
}
