
var Client = require('./client');

module.exports = function (url) {

  var client = new Client();
  var ws = new WebSocket(url);

  client.on('request', function (req) {
    ws.send(JSON.stringify(req));
  });

  ws.addEventListener('message', function (event) {
    var obj;

    try {
      obj = JSON.parse(event.data);
    } catch (err) {
      client.emit('error', err);
    }

    client.handleMessage(obj);
  });

  return client;
};
