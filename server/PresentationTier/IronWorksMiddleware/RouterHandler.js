var express = require('express')
var router = express.Router()
var index = require('../ClientResponseSender/IndexResponseSender')
var gen = require('../CodegenRoute/proxyGenHandler')

var codeHandler = function (req, res, next) {
  var proxy = new gen.Proxygen()
  proxy.process(req, res, next)
}

var indexHandler = function (req, res, next) {
  var out = new index.IndexResponseSender()
  out.sender(req, res, next)
}

router.get('/', indexHandler)
router.post('/', codeHandler)

module.exports = {
  'router': router
}
