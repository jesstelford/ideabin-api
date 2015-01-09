var dispatch = require('../dispatch');

/**
 * @param db Object a forkdb instance
 */
module.exports = function(db) {
  dispatch.on('action:getComment', function(req, res) {
    res.json(req.params);
  });
}
