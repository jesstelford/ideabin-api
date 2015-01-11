var dispatch = require('../dispatch');

/**
 * @param fdb Object a forkdb instance
 */
module.exports = function(fdb) {
  dispatch.on('action:postComment', function(ideaId, commentData, req, res) {
    res.json(req.body);
  });
}
