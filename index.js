var urlParse = require('url').parse

var glueHttp = require('./lib/glue-http')
var glueWebSocket = require('./lib/glue-websocket')

var webSocketErrorText = [
  'To use raptor-client with a WebSocket host, a WebSocket implementation needs to be provided. Example:',
  '',
  'const raptor = require(\'raptor-client\')',
  'const WebSocket = require(\'ws\')',
  '',
  'const client = raptor(\'ws://localhost\', { WebSocket })',
  ''
].join('\n')

function createClient (url, options) {
  var info = urlParse(url)

  switch (info.protocol) {
    case 'http:':
    case 'https:':
      return glueHttp(url)
    case 'ws:':
    case 'wss:':
      if (!options || !options.WebSocket) {
        throw new Error(webSocketErrorText)
      }

      return glueWebSocket(url, options.WebSocket)
    default:
      throw new Error('Unknown protocol: ' + info.protocol)
  }
}

module.exports = createClient
