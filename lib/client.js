
var events = require('events');
var EventEmitter = events.EventEmitter;

function Client() {
  EventEmitter.call(this);

  this._id = 0;
  this._cb = {};

}

Client.prototype = Object.create(EventEmitter.prototype);

Client.prototype._registerCallback = function (cb) {
  this._cb[this._id] = cb;
  return this._id++;
};

Client.prototype.send = function send(method, params, cb) {
  if (typeof method !== 'string') { throw new TypeError('Method must be a string'); }
  if (typeof params === 'function') { cb = params; params = undefined; }
  if (params && typeof params !== 'object') { throw new TypeError('Params can only be provided as array or object'); }

  var req = {
    jsonrpc: '2.0',
    method: method
  };

  if (typeof cb === 'function') {
    req.id = this._registerCallback(cb);
  }

  if (params) {
    req.params = params;
  }

  this.emit('request', req);
};

Client.prototype.handleMessage = function (msg) {

  if (msg.hasOwnProperty('id') === false) {
    this.emit('notification', msg);
    return ;
  }

  if (this._cb.hasOwnProperty('' + msg.id) === false) {
    this.emit('error', new Error('Server responded to unknown request (id: ' + msg.id + ')'));
    return ;
  }

  var hasError = msg.hasOwnProperty('error');
  var hasResult = msg.hasOwnProperty('result');

  if (hasResult && hasError) {
    this.emit('error', new Error('Server responded with both result and error (id: ' + msg.id + ')'))
    return ;
  }

  if (!hasResult && !hasError) {
    this.emit('error', new Error('Server responded with neither result nor error (id: ' + msg.id + ')'))
    return ;
  }

  var err = null;
  var cb = this._cb['' + msg.id];
  delete this._cb['' + msg.id];

  if (hasError) {
    var err = new Error(msg.error.message);
    err.rpcCode = msg.error.code;
    err.rpcData = msg.error.data;
  }

  cb(err, msg.result);
};

module.exports = Client;
