var express = require('express')
var router = express.Router()

function ErrorHandler () {
  this.handler = function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  }
}

function handler (err, req, res, next) {
  var aux = new ErrorHandler()
  aux.handler(err.req, res, next)
}
router.use('/', handler)

module.exports = {
  'router': router
}
