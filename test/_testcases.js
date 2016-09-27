var assert = require('assert')

module.exports = [
  ['sends request to server', function (server, client) {
    server.method('add', function (req) { return (req.param(0) + req.param(1)) })

    return client.send('add', [5, 12])
      .then(function (res) { assert.equal(res, 5 + 12) })
  }],
  ['sends notifications to the server', function (server, client) {
    var received = new Promise(function (resolve) {
      server.method('test-notificaiton', function (req) { resolve(req.param(0)) })
    })

    return client.notify('test-notificaiton', ['Hello world!'])
      .then(function () { return received })
      .then(function (msg) { assert.equal(msg, 'Hello world!') })
  }],
  ['accepts 0 as result', function (server, client) {
    server.method('return-zero', function (req) { return 0 })

    return client.send('return-zero')
      .then(function (res) { assert.equal(res, 0) })
  }]
]
