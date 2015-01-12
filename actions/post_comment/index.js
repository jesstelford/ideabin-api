var dispatch = require('../../dispatch'),
    dbManager = require('../../dbManager');

module.exports = function() {
  dispatch.on('action:postComment', function(ideaId, commentData, req, res, next) {
    res.json(req.body);
  });
}
