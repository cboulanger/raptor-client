/* eslint-env mocha */

var createClient = require('../')
var RaptorServer = require('raptor-rpc')
var testCases = require('./_testcases')

var PORT = 40000

describe('raptor#http', function () {
  var client, server, transport

  before(function (done) {
    client = createClient('http://localhost:' + PORT)
    server = new RaptorServer()

    transport = server.serve('http', PORT, done)
  })

  after(function (done) {
    transport.close(done)
  })

  testCases.forEach(function (testCase) {
    it(testCase[0], function () {
      return testCase[1](server, client)
    })
  })
})
