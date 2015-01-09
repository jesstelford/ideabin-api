/**
 * Add routes to the server
 * @param server Object The Restify server to add routes to
 * @param dispatch Object An EventEmitter to trigger route events on
 * @param callback Function The completion callback
 */
module.exports = function(server, dispatch, callback) {

  // Setup the routes
  server.get('/idea/:ideaId/comment/:commentId', function(req, res, next) {
    dispatch.emit('action:getComment', req, res);
    // Stop handling routes here
    return next(false);
  });

  server.post('/idea/:ideaId/comment', function(req, res, next) {
    dispatch.emit('action:postComment', req, res);
    // Stop handling routes here
    return next(false);
  });

  server.get('/idea/:ideaId', function(req, res, next) {
    dispatch.emit('action:getIdea', req, res);
    // Stop handling routes here
    return next(false);
  });

  server.post('/idea', function(req, res, next) {
    dispatch.emit('action:postIdea', req, res);
    // Stop handling routes here
    return next(false);
  });

  callback()

}
