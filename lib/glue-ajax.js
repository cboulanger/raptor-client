/* global XMLHttpRequest */

var Client = require('./client')
var debug = require('debug')('raptor:client')

module.exports = function (url) {
  debug('Creating new client with url ' + url)

  return new Client(function (req) {
    var client = this

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()

      xhr.addEventListener('error', function (event) {
        reject(new Error('Error communicating with server'))
      })

      xhr.addEventListener('load', function (event) {
        var obj

        debug('Response received')

        // Notifications will not get any response
        if (req.id === undefined) {
          debug('Skipping reading of body')
          return resolve()
        }

        try {
          obj = JSON.parse(xhr.responseText)
        } catch (err) {
          debug('Error parsing body as JSON')
          return reject(err)
        }

        // Resolve sending promise
        resolve()

        // Send response to the client
        client.handleMessage(obj)
      })

      debug('Sending request to ' + url)

      xhr.open('POST', url)
      xhr.setRequestHeader('Content-Type', 'application/json')

      // authorization
      if (client.getAuthToken()) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + client.getAuthToken())
      }

      xhr.send(JSON.stringify(req))
    })
  })
}
