var dispatch = require('../dispatch');

/**
 * @param db Object a forkdb instance
 */
module.exports = function(db) {
  dispatch.on('action:postIdea', function(req, res) {
    db
    res.json(req.body);
  });
}
