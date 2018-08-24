process.env.NODE_ENV = 'test'

// stub
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const server = require('../app')

// data
var errorRequestPayload = {'this': 'is a error'}
var goodRequestPayload = {
  'data':
    [
      {
        'entityId': 'cdbb9be5-3cd2-411f-b2b1-2884b2160dcc',
        'package': 'org.warmachine.ironworks.generated',
        'entityName': 'Entity',
        'dataFields': [{
          'fieldName': 'z', 'fieldType': 'INT', 'notNull': 'false', 'primaryK': 'true'
        }]
      }
    ]
}

describe('POST', function () {
  describe('POST /codegen', function () {
    it('should get a valid response for a valid request', function (done) {
      chai.request(server)
        .post('/codegen')
        .send(goodRequestPayload)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.text.should.contain('package org.warmachine.ironworks.generated;')
          res.status.should.equal(200)
        })
      done()
    })

    it('should get a not valid response for a not valid request', function (done) {
      chai.request(server)
        .post('/codegen')
        .send(errorRequestPayload)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          // res.text.should.not.contain('package org.warmachine.ironworks.generated;')
          res.status.should.equal(500)
        })
      done()
    })
  })
})
