var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

function Client (sendMessage) {
  EventEmitter.call(this)

  this._nextId = 0
  this._callbacks = new Map()
  this._sendMessage = sendMessage
}

inherits(Client, EventEmitter)

Client.prototype._registerCallback = function (cb) {
  var id = this._nextId++
  this._callbacks.set(id, cb)
  return id
}

Client.prototype._retrieveCallback = function (id) {
  var cb = this._callbacks.get(id)
  this._callbacks.delete(id)
  return cb
}

Client.prototype.send = function (method, params, auth) {
  var self = this

  if (typeof method !== 'string') { throw new TypeError('Method must be a string') }
  if (params && typeof params !== 'object') { throw new TypeError('Params can only be provided as array or object') }

  var req = { jsonrpc: '2.0', method: method, params: params }

  if (auth) req.auth = auth; // as per jsonrpc auth extension
  
  var callback = new Promise(function (resolve, reject) {
    req.id = self._registerCallback({ resolve: resolve, reject: reject })
  })

  return Promise.resolve()
    .then(function () { return self._sendMessage(req) })
    .then(function () { return callback })
}

Client.prototype.notify = function (method, params, auth) {
  var self = this

  if (typeof method !== 'string') { throw new TypeError('Method must be a string') }
  if (params && typeof params !== 'object') { throw new TypeError('Params can only be provided as array or object') }

  var req = { jsonrpc: '2.0', method: method, params: params }

  if (auth) req.auth = auth; // as per jsonrpc auth extension
  
  return Promise.resolve()
    .then(function () { return self._sendMessage(req) })
}

Client.prototype.handleMessage = function (msg) {
  if (msg.hasOwnProperty('id') === false) {
    return this.emit('notification', msg)
  }

  if (this._callbacks.has(msg.id) === false) {
    return this.emit('error', new Error('Server responded to unknown request (id: ' + msg.id + ')'))
  }

  var hasError = msg.hasOwnProperty('error')
  var hasResult = msg.hasOwnProperty('result')

  if (hasResult && hasError) {
    return this.emit('error', new Error('Server responded with both result and error (id: ' + msg.id + ')'))
  }

  if (!hasResult && !hasError) {
    return this.emit('error', new Error('Server responded with neither result nor error (id: ' + msg.id + ')'))
  }

  var cb = this._retrieveCallback(msg.id)

  if (hasError) {
    var err = new Error(msg.error.message)
    err.rpcCode = msg.error.code
    err.rpcData = msg.error.data
    return cb.reject(err)
  }

  cb.resolve(msg.result)
}

module.exports = Client
