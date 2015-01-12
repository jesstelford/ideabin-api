var dispatch = require('../dispatch'),
    dbManager = require('../dbManager');

module.exports = function() {
  dispatch.on('action:getIdea', function(ideaId, req, res) {
    res.json(req.params);
  });
}
