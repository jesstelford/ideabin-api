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

/**
 * @param id String The id to escape
 * @return String The escaped id. `undefined` if `id` not set.
 */
function escapeId(id) {
  // TODO: Implement me
  return id;
}

/**
 * @param key String The ForkDB key to add
 * @param prevData Array The array of previous hashes to process
 * @return Array [ { key: '<the key>', hash: '<the hash>' } ]
 */
function addKeyToPrev(key, prevData) {
  return prevData.map(function(prev) {
    return {
      key: key,
      hash: prev
    }
  });
}

module.exports = function() {

  dispatch.on('action:postIdea', function(ideaData, req, res, next) {

    var writeMeta = {},

        // Ensure data passes schema validation
        validationError = actionUtils.validateParams(validateJson, ideaData);

    if (validationError) {
      return next(validationError);
    }

    // The idea's ID - generate a new one if one doesn't exist
    writeMeta.key = escapeId(ideaData.id) || cuid();

    // Generate the appropriate 'prev' data
    writeMeta.prev = addKeyToPrev(writeMeta.key, ideaData.prev || []);

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
