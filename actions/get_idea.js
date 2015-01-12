var dispatch = require('../dispatch'),
    dbManager = require('../dbManager');

module.exports = function() {
  dispatch.on('action:getIdea', function(ideaId, req, res, next) {
    res.json(req.params);
  });
}
