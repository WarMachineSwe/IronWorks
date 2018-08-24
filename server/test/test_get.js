process.env.NODE_ENV = 'test'

// stub
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const server = require('../app')

describe('routes: index', function () {
  describe('GET /', function () {
    it('It should GET the homepage', function (done) {
      chai.request(server)
        .get('/')
        .end(function (err, res) {
          res.statusCode.should.eql(200)
          res.text.should.contain('<h1 class="display-1">IronWorks</h1>')
          done()
        })
    })
  })

  describe('GET 404', function () {
    it('It should GET a page not found', function (done) {
      chai.request(server)
        .get('/aPageThatDoesNotExist')
        .end(function (err, res) {
          res.statusCode.should.eql(404)
          res.text.should.contain('Ooops something went wrong!!')
          done()
        })
    })
  })

  describe('GET 404 via json', function () {
    it('It should GET a page not found', function (done) {
      chai.request(server)
        .get('/aPageThatDoesNotExist')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.statusCode.should.eql(404)
          res.text.should.equal('{"error":"Not found"}')
          done()
        })
    })
  })

  describe('GET 404 via text', function () {
    it('It should GET a page not found', function (done) {
      chai.request(server)
        .get('/aPageThatDoesNotExist')
        .set('Accept', 'application/text')
        .end(function (err, res) {
          res.statusCode.should.eql(404)
          res.text.should.equal('Not found')
          done()
        })
    })
  })

  describe('GET /app.html', function () {
    it('It should GET the app page', function (done) {
      chai.request(server)
        .get('/app.html')
        .end(function (err, res) {
          res.statusCode.should.eql(200)
          res.text.should.contain('Boundary')
          done()
        })
    })
  })
})
