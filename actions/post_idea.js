var cuid = require('cuid'),
    dispatch = require('../dispatch'),
    dbManager = require('../dbManager'),
    actionUtils = require('./utils');

function escapeHash(hash) {
  // TODO: Implement me
  return hash;
}

function escapeId(id) {
  // TODO: Implement me
  return id;
}

module.exports = function() {

  var ideaDb = dbManager.get('ideas');

  dispatch.on('action:postIdea', function(ideaData, req, res, next) {

    var requiredError = actionUtils.checkRequiredParams(['idea'], ideaData);

    if (requiredError) {
      return next(requiredError);
    }

    if (ideaData.id) {
      ideaData.id = escapeId(ideaData.id);
    } else {
      ideaData.id = cuid();
    }

    ideaDb
      .createWriteStream({key: ideaData.id}, function(err, key) {
        if (err) {
          return next(restify.restError('blah'));
        }

        res.json(ideaData);
      })
      .end(ideaData.idea);
  });

}
