var urlParse = require('url').parse

var glueAjax = require('./lib/glue-ajax')
var glueWebSocket = require('./lib/glue-websocket')

function createClient (url) {
  var info = urlParse(url)

  switch (info.protocol) {
    case 'http:':
    case 'https:':
      return glueAjax(url)
    case 'ws:':
    case 'wss:':
      return glueWebSocket(url, window.WebSocket)
    default:
      throw new Error('Unknown protocol: ' + info.protocol)
  }
}

module.exports = createClient
