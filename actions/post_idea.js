var dispatch = require('../dispatch'),
    dbManager = require('../dbManager');

module.exports = function() {

  dispatch.on('action:postIdea', function(ideaData, req, res, next) {
    res.json(ideaData);
  });

}
