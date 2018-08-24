var express = require('express') // server routing
var path = require('path')
var bodyParser = require('body-parser') // parse POST requests body
var morgan = require('morgan')
var routerHandler = require('./PresentationTier/IronWorksMiddleware/RouterHandler')
var errorHandler = require('./PresentationTier/IronWorksMiddleware/ErrorHandler')
var notFoundErrorHandler = require('./PresentationTier/IronWorksMiddleware/NotFoundErrorHandler')
var app = express() // create server routes

//abilitate this to debug
app.use(morgan('dev'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// usages
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// everything inside /src is static
app.use(express.static(path.join(__dirname, 'src')))

// generate java and sql code
app.use('/codegen', routerHandler.router)

// not found
app.get('*', notFoundErrorHandler.handle)

// more errors
app.get('*', errorHandler.handle)

module.exports = app
