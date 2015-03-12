
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
var raptor = require('raptor-client');
var client = raptor('http://localhost/api');

client.send('add', [1, 2], function (err, res) {
  if (err) { throw err; }

  console.log('1 + 2 =', res);
});
```

*Web Sockets*
```javascript
var raptor = require('raptor-client');
var client = raptor('ws://localhost');

client.send('add', [1, 2], function (err, res) {
  if (err) { throw err; }

  console.log('1 + 2 =', res);
});

client.on('notification', function (msg) {
  // The server wants something!
});
```

## API

### `raptor(uri)`

Returns a new `Client` connected to the specific uri.

Supported protocols in the browser: `http`, `https`, `ws`, `wss`
Supported protocols on Node.js: `http`, `https`

### Event: `notification`

The server has sent a notification to us.

### `Client#send(method[, params][, callback])`

Send a request to the server. If `callback` isn't specified the request is sent
as a notification and the server is not expected to respond.

`callback` will be called with `(err, res)` when the server answers.
 - `err`: Error as returned from server. `.rpcCode` and `.rpcData` is populated
   from the server response.
 - `res`: Result as returned from the server.

## License

MIT
