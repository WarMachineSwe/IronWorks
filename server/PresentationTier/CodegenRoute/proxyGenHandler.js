var codegen = require('./codeGenHandler.js')

/**
 * Generates the proxy-codegen class that handles the request and if the conditions are satisfied instance a codeGenerator obj
 */
function Proxygen () {
  this.gen = new codegen.Codegen()

  /**
   * Proxyes client request to client request handler
   * @param req {XTTHPRequest} Client request
   * @param res {XTTHPResponse} Client response
   * @param next {function} What to do next
   */
  this.process = function (req, res, next) {
    try {
      this.gen.process(req, res, next)
    } catch (error) {
      console.log(error)
      res.status(500) // server error
      res.json(error) // send exception
    }
  }
}

module.exports = {
  'Proxygen': Proxygen
}
