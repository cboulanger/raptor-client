
var Client = require('./client');

module.exports = function (url) {

  var client = new Client();

  client.on('request', function (req) {

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('error', function (event) {
      client.emit('error', new Error('Error communicating with server'));
    });

    xhr.addEventListener('load', function (event) {
      var obj;

      try {
        obj = JSON.parse(xhr.responseText);
      } catch (err) {
        client.emit('error', err);
      }

      client.handleMessage(obj);
    });

    xhr.open('POST', url);
    xhr.send(JSON.stringify(req));

  });

  return client;
};
