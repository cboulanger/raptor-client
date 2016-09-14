var url = require('url')
var http = require('http')
var https = require('https')
var Client = require('./client')

var urlParse = url.parse

module.exports = function (url) {
  var client = new Client()
  var remote = urlParse(url)
  var protocol = remote.protocol === 'https:' ? https : http

  remote.method = 'post'

  client.on('request', function (obj) {
    var chunks = []
    var raw = new Buffer(JSON.stringify(obj))
    var req = protocol.request(remote, function (res) {
      res.on('error', function (err) {
        client.emit('error', err)
      })

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', function () {
        var obj
        var raw = Buffer.concat(chunks)

        try {
          obj = JSON.parse(raw.toString())
        } catch (err) {
          client.emit('error', err)
        }

        client.handleMessage(obj)
      })
    })

    req.on('error', function (err) {
      client.emit('error', err)
    })

    req.end(raw)
  })

  return client
}
