/* eslint-env mocha */

var assert = require('assert')
var raptorClient = require('../')
var RaptorServer = require('raptor-rpc')

var PORT = 40000

describe('raptor#http', function () {
  var client, server, transport

  before(function (done) {
    client = raptorClient('http://localhost:' + PORT)
    server = new RaptorServer()
    server.method('add', function (req, cb) { cb(null, req.param(0) + req.param(1)) })
    transport = server.serve('http', PORT)
    transport.on('listening', done)
  })

  it('sends request to server', function (done) {
    client.send('add', [5, 12], function (err, res) {
      assert.ifError(err)
      assert.equal(res, 5 + 12)
      done()
    })
  })

  it('sends notifications to the server', function (done) {
    server.method('test-notificaiton', function (req, cb) {
      assert.equal(req.param(0), 'Hello world!')
      cb(null)
      done()
    })
    client.send('test-notificaiton', ['Hello world!'])
  })

  it('accepts 0 as result', function (done) {
    server.method('return-zero', function (req, cb) {
      cb(null, 0)
    })
    client.send('return-zero', function (err, res) {
      assert.ifError(err)
      assert.equal(res, 0)
      done()
    })
  })

  after(function (done) {
    transport.close(function () {
      client = undefined
      server = undefined
      transport = undefined
      done()
    })
  })
})
