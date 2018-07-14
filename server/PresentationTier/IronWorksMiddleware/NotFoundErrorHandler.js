var express = require('express')
var router = express.Router()

function NotFoundErrorHandler () {
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

function handler (err, req, res, next) {
  var aux = new NotFoundErrorHandler()
  aux.handler(err.req, res, next)
}
router.use('/', handler)

module.exports = {
  'router': router
}
