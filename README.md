
# Raptor RPC Client

A transport-agnostic RPC client that follows the JSON-RPC 2.0 spec. Works in
the browser and on the server.

## Installation

```sh
npm install --save raptor-client
```

## Usage

*AJAX*
```javascript
var raptor = require('raptor-client')
var client = raptor('http://localhost/api')

client.send('add', [1, 2], function (err, res) {
  if (err) throw err

  console.log('1 + 2 =', res)
})
```

*Web Sockets*
```javascript
var raptor = require('raptor-client')
var client = raptor('ws://localhost')

client.send('add', [1, 2], function (err, res) {
  if (err) throw err

  console.log('1 + 2 =', res)
})

client.on('notification', function (msg) {
  // The server wants something!
})
```

## API

### `raptor(uri)`

Returns a new `Client` connected to the specific uri.

Supported protocols in the browser: `http`, `https`, `ws`, `wss`
Supported protocols on Node.js: `http`, `https`

### Event: `notification`

The server has sent a notification to us.

### `Client#send(method[, params]) => Promise<any>`

Send a request to the server. Returns a promise of the result from the server.

If an error response is returned from the sever, the promise will reject with an
error that has `.rpcCode` and `.rpcData` populated from the response.

### `Client#notify(method[, params]) => Promise<void>`

Send a notification to the server. Returns a promise that will resolve when the
notification has been sent to server.

The promise will only reject if there is a network problem, since a server
cannot respond to a notification.

## License

MIT
