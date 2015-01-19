'use strict';

var dispatch = require('../../dispatch');

module.exports = function postCommentAction() {
  dispatch.on(
    'action:postComment',
    function postCommentHandler(ideaId, commentData, req, res) {
      res.json(req.body);
    }
  );
};
