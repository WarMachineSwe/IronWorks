function indexResponseSender () {
  this.sender = function (req, res, next) {
    res.sendFile('/index.html')
  }
}

module.exports = {
  'IndexResponseSender': indexResponseSender
}
