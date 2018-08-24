/**
 * Handles 404 requests
 */
function NotFoundErrorHandler () {

  /**
   * Handles request sending appropriate responses based on request method
   * @param req client request
   * @param res server response
   * @param next {func} what to to next
   */
  this.handler = function (req, res, next) {
    res.status(404) // mark as 404

    // respond with html page
    if (req.accepts('html')) {
      res.render('404', {url: req.url})
      return
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({error: 'Not found'})
      return
    }

    res.type('txt').send('Not found') // default to plain-text
  }
}

/**
 * Handles 404 request
 * @param req client request
 * @param res server response
 * @param next {func} what to to next
 */
function handle (req, res, next) {
  var handler = new NotFoundErrorHandler()
  handler.handler(req, res, next)
}

module.exports = {
  'handle': handle
}
