var url = require('url')
var http = require('http')
var https = require('https')
var Client = require('./client')
var debug = require('debug')('raptor:client')

var urlParse = url.parse

module.exports = function (url) {
  debug('Creating client with url ' + url)

  var remote = urlParse(url)
  var protocol = remote.protocol === 'https:' ? https : http

  remote.method = 'post'
  remote.headers = {
    'Content-Type' : 'application/json',
    'Accept' : 'application/json'
  }
  return new Client(function (obj) {
    var client = this

    debug('Sending request')

    return new Promise(function (resolve, reject) {
      var chunks = []
      var raw = new Buffer(JSON.stringify(obj))
      remote.headers.Authorization = 'Bearer ' + client.getAuthToken()
      var req = protocol.request(remote, function (res) {
        res.on('error', function (err) {
          reject(err)
        })

        debug('Received response')

        // Notifications will not get any response
        if (obj.id === undefined) {
          debug('Skipping body')
          res.resume()
          resolve()
          return
        }

        // Collect JSON data
        res.on('data', function (chunk) {
          chunks.push(chunk)
        })

        res.on('end', function () {
          var obj
          var raw = Buffer.concat(chunks)

          try {
            obj = JSON.parse(raw.toString())
          } catch (err) {
            debug('Error parsing body as JSON')
            return reject(err)
          }

          // Resolve sending promise
          resolve()

          // Send response to the client
          client.handleMessage(obj)
        })
      })

      req.on('error', function (err) {
        reject(err)
      })

      req.end(raw)
    })
  })
}
