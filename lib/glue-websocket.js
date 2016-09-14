/* global WebSocket */

var Client = require('./client')
var WhenReady = require('./when-ready')

module.exports = function (url) {
  var client = new Client()
  var ws = new WebSocket(url)
  var ready = new WhenReady()

  client.on('request', function (req) {
    ready.once(function () {
      ws.send(JSON.stringify(req))
    })
  })

  ws.addEventListener('open', function () {
    ready.emit()
  })

  ws.addEventListener('message', function (event) {
    var obj

    try {
      obj = JSON.parse(event.data)
    } catch (err) {
      client.emit('error', err)
    }

    client.handleMessage(obj)
  })

  return client
}
