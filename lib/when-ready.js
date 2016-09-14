function WhenReady () {
  this.ready = false
  this.queue = []
}

WhenReady.prototype.once = function (fn) {
  if (this.ready) { return fn() }
  this.queue.push(fn)
}

WhenReady.prototype.emit = function () {
  this.ready = true
  this.queue.forEach(function (fn) { fn() })
  this.queue = []
}

module.exports = WhenReady
