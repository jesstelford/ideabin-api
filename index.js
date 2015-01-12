var fs = require('fs'),
    setup = require('./setup'),
    routes = require('./routes'),
    dispatch = require('./dispatch'),
    dbManager = require('./dbManager'),
    server,
    VERSION = "1.0.0",
    PORT = 8080,
    SSL_KEY = './key.pem',
    SSL_CERT = './cert.pem';

// Register all the action listeners
require('./actions')();

var setup = require('./setup');

// Check for generated keys
if (!fs.existsSync(SSL_CERT) || !fs.existsSync(SSL_KEY)) {
  return console.error("Certificate not found.\n\nGenerate a self-signed certificate with:\n\n> make generate-certs");
}

setup({
  certificate: fs.readFileSync(SSL_CERT),
  key: fs.readFileSync(SSL_KEY),
  name: require('./package.json').name,
  version: VERSION,
  throttle: {
    burst: 100,
    rate: 50, // requests per second
    ip: true, // throttle based on ip
    // username: true, // throttle based on req.username
    overrides: {
      '192.168.1.1': {
        rate: 0,        // unlimited
        burst: 0
      }
    }
  }
}, function(server) {

  routes(server, dispatch, function() {

    server.listen(PORT, function() {
      dispatch.emit('server:listening', server);
      console.log('%s listening at %s', server.name, server.url);
    });

  });

});
