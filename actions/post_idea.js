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

    var writeMeta = {},

        // Ensure all required parameters exist
        requiredError = actionUtils.checkRequiredParams(['idea'], ideaData);

    if (requiredError) {
      return next(requiredError);
    }

    // The idea's ID
    if (ideaData.id) {
      writeMeta.key = escapeId(ideaData.id);
    } else {
      writeMeta.key = cuid();
    }

    if (ideaData.prev) {
      writeMeta.prev = escapeId(ideaData.prev);
    }

    // Write the Idea data
    ideaDb
      .createWriteStream(writeMeta, function(err, hash) {

        // If there was a database error
        // TODO: A better error type / message
        if (err) { return next(restify.restError('blah')); }

        // Send back the success response
        res.json({
          id: writeMeta.key,
          hash: hash
        });
      })
      // Pipe the idea data into the db
      .end(ideaData.idea);
  });

}
