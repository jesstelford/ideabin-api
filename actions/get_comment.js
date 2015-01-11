var dispatch = require('../dispatch');

/**
 * @param fdb Object a forkdb instance
 */
module.exports = function(fdb) {
  dispatch.on('action:getComment', function(ideaId, commentId, req, res) {
    res.json(req.params);
  });
}
