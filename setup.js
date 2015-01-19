'use strict';

var restify = require('restify');

/**
 * Create a Restify server
 *
 * @param options Object The options sent to Restify's .createServer method.
 * Additional options:
 *   throttle: {} - The options for restify.throttle() If not set, no throttling
 *   performed
 * @param callback Function Will be called with the server once setup complete
 */
module.exports = function serverSetup(options, callback) {

  // Initialize our server
  var server = restify.createServer(options);

  // Close the connection for curl immediately
  server.pre(restify.pre.userAgentConnection());

  // Clean trailing slashes, etc
  server.pre(restify.pre.sanitizePath());

  // Parse JSON bodies, etc
  server.use(restify.bodyParser());

  if (options.throttle) {
    // Rate limit API requests, sends 429 Too Many Requests on throttle
    server.use(restify.throttle(options.throttle));
  }

  // Make sure we can respond to what was asked for (HTTP 406 if not)
  server.use(restify.acceptParser(server.acceptable));

  // parse the query string, but don't override params with query values of the
  // same key
  server.use(restify.queryParser({ mapParams: false }));

  // Allow JSONP requests (will look for 'callback' or 'jsonp' query strings)
  server.use(restify.jsonp());

  // If client sends 'accept-encoding: gzip' header, gzip it for them!
  server.use(restify.gzipResponse());

  callback(server);

};
