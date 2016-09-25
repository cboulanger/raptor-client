/* eslint-env mocha */

var createClient = require('../')
var RaptorServer = require('raptor-rpc')
var testCases = require('./_testcases')
var WebSocket = require('ws')

var WebSocketServer = WebSocket.Server

var PORT = 40001

describe('raptor#ws', function () {
  var client, server, transport

  before(function (done) {
    client = createClient('ws://localhost:' + PORT, { WebSocket: WebSocket })
    server = new RaptorServer()
    transport = new WebSocketServer({ port: PORT })

    transport.on('connection', function (ws) {
      var connection = server.connection(ws)

      ws.on('message', function (message) {
        connection.handleBuffer(message).then(function (response) {
          if (response) ws.send(JSON.stringify(response))
        })
      })
    })

    transport.on('listening', done)
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
