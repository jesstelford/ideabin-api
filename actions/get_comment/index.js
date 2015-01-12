var dispatch = require('../../dispatch'),
    dbManager = require('../../dbManager');

module.exports = function() {

  var ideaDb = dbManager.get('ideas'),
      commentDb = dbManager.get('comments');

  dispatch.on('action:getComment', function(ideaId, commentId, req, res, next) {
    res.json(req.params);
  });

}
