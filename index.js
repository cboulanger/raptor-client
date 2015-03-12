
var url = require('url');
var urlParse = url.parse;

function glue(url) {

  var info = urlParse(url);

  switch (info.protocol) {
    case 'http:':
      return require('./lib/glue-http')(url);
    // case 'https:':
    //   return require('./lib/glue-https')(url);
    // case 'tcp:':
    //   return require('./lib/glue-net')(url);
    // case 'udp:':
    //   return require('./lib/glue-dgram')(url);
    default:
      throw new Error('Unknown protocol: ' + info.protocol);
  }
}

module.exports = glue;
