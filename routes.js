
/**
 * Add routes to the server
 * @param server Object The Restify server to add routes to
 * @param callback Function The completion callback
 */
module.exports = function(server, callback) {

  // Setup the routes
  server.get('/idea/:id', function(req, res, next) {

    res.json(req.params);

    // Stop handling routes here
    return next(false);
  });

  callback()

}
