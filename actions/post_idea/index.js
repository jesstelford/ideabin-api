var cuid = require('cuid'),
    restify = require('restify'),
    dispatch = require('../../dispatch'),
    dbManager = require('../../dbManager'),
    actionUtils = require('../utils'),
    schemaLoader = require('is-my-json-valid/require'),

    ideaDb = dbManager.get('ideas'),
    validateJson = schemaLoader('./schema.orderly');

function escapeHash(hash) {
  // TODO: Implement me
  return hash;
}

function escapeId(id) {
  // TODO: Implement me
  return id;
}

module.exports = function() {

  dispatch.on('action:postIdea', function(ideaData, req, res, next) {

    var writeMeta = {},

        // Ensure data passes schema validation
        validationError = actionUtils.validateParams(validateJson, ideaData);

    if (validationError) {
      return next(validationError);
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
        // TODO: Logging when there's an error
        if (err) { return next(restify.InternalError("Couldn't save idea")); }

        // Success! Send back the success response
        res.json({
          id: writeMeta.key,
          hash: hash
        });
      })
      // Pipe the idea data into the db
      .end(ideaData.idea);
  });

}
