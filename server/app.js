var express = require('express') // server routing
var path = require('path')
var cookieParser = require('cookie-parser') // parse cookies
var logger = require('morgan')
var bodyParser = require('body-parser') // parse POST requests body
var routerHandler = require('./PresentationTier/IronWorksMiddleware/RouterHandler')
var errorHandler = require('./PresentationTier/IronWorksMiddleware/ErrorHandler')
var notFoundErrorHandler = require('./PresentationTier/IronWorksMiddleware/NotFoundErrorHandler')
var app = express() // create server routes

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// usages
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// everything inside /src is static
app.use(express.static(path.join(__dirname, 'src')))

// index
app.use('/', routerHandler.router)

// generate java and sql code
app.use('/codegen', routerHandler.router)

app.use(notFoundErrorHandler.router)

// error handler
app.use(errorHandler.router)

module.exports = app
