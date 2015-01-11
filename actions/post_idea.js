var dispatch = require('../dispatch');

/**
 * @param fdb Object a forkdb instance
 */
module.exports = function(fdb) {
  dispatch.on('action:postIdea', function(ideaData, req, res) {
    res.json(req.body);
  });
}
