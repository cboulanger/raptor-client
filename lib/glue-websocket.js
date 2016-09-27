var Client = require('./client')
var debug = require('debug')('raptor:client')

module.exports = function (url, WebSocket) {
  debug('Creating new client with url ' + url)

  var ws = new WebSocket(url)

  var ready = new Promise(function (resolve) {
    ws.addEventListener('open', resolve)
  })

  var sendMessage = function (req) {
    return ready.then(function () {
      debug('Sending message')
      ws.send(JSON.stringify(req))
    })
  }

  var client = new Client(sendMessage)

  ws.addEventListener('message', function (event) {
    var err, obj

    debug('Received message')

    try {
      obj = JSON.parse(event.data)
    } catch (_err) {
      err = _err
    }

    if (err) {
      client.emit('error', err)
    } else {
      client.handleMessage(obj)
    }
  })

  ws.addEventListener('error', function (err) {
    client.emit('error', err)
  })

  return client
}
