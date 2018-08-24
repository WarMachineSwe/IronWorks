var express = require('express')
var router = express.Router()
var gen = require('../CodegenRoute/proxyGenHandler')

/**
 * Handles /codegen request
 * @param req client request
 * @param res server response
 * @param next {func} what to to next
 */
var codeHandler = function (req, res, next) {
  var proxy = new gen.Proxygen()
  proxy.process(req, res, next)
}

router.post('/', codeHandler)

module.exports = {
  'router': router
}
