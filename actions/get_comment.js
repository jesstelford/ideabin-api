var dispatch = require('../dispatch');

/**
 * @param fdb Object a forkdb instance
 */
module.exports = function(fdb) {
  dispatch.on('action:getComment', function(req, res) {
    res.json(req.params);
  });
}
