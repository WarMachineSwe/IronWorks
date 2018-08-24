/**
 * Handles errors
 */
function ErrorHandler () {

  /**
   * Handles request
   * @param req client request
   * @param res server response
   * @param next {func} what to to next
   */
  this.handler = function (req, res, next) {
    res.status(500) // mark as 500

    // respond with html page
    if (req.accepts('html')) {
      res.render('error', {url: req.url})
      return
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({error: 'Cannot GET'})
      return
    }

    res.type('txt').send('Cannot GET') // default to plain-text
  }
}

/**
 * Handles errors request
 * @param req client request
 * @param res server response
 * @param next {func} what to to next
 */
function handle (req, res, next) {
  var handler = new ErrorHandler()
  handler.handler(req, res, next)
}

module.exports = {
  'handle': handle
}
