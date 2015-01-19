'use strict';

var dispatch = require('../../dispatch');

module.exports = function getCommentAction() {

  dispatch.on(
    'action:getComment',
    function getCommentHandler(ideaId, commentId, req, res) {
      res.json(req.params);
    }
  );

};
