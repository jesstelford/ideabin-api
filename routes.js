'use strict';

/**
 * Add routes to the server
 * @param server Object The Restify server to add routes to
 * @param dispatch Object An EventEmitter to trigger route events on
 * @param callback Function The completion callback
 */
module.exports = function routes(server, dispatch, callback) {

  // Setup the routes
  server.get(
    '/idea/:ideaId/comment/:commentId',
    function getComment(req, res, next) {
      dispatch.emit(
        'action:getComment',
        req.params.ideaId,
        req.params.commentId,
        req,
        res,
        next
      );
      // Stop handling routes here
      return next(false);
    }
  );

  server.post(
    '/idea/:ideaId/comment',
    function postComment(req, res, next) {
      dispatch.emit(
        'action:postComment',
        req.params.ideaId,
        req.body,
        req,
        res,
        next
      );
      // Stop handling routes here
      return next(false);
    }
  );

  server.get(
    '/idea/:ideaId/:owner/:version',
    function getIdeaByVersion(req, res, next) {
      dispatch.emit(
        'action:getIdea',
        req.params.ideaId,
        req.params.owner,
        req.params.version,
        req,
        res,
        next
      );
      // Stop handling routes here
      return next(false);
    }
  );

  // Optional `version`
  server.get(
    '/idea/:ideaId/:owner',
    function getIdea(req, res, next) {
      dispatch.emit(
        'action:getIdea',
        req.params.ideaId,
        req.params.owner,
        undefined,
        req,
        res,
        next
      );
      // Stop handling routes here
      return next(false);
    }
  );

  server.post(
    '/idea',
    function postIdea(req, res, next) {
      dispatch.emit(
        'action:postIdea',
        req.body,
        req,
        res,
        next
      );
      // Stop handling routes here
      return next(false);
    }
  );

  callback();

};
