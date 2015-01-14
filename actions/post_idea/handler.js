var cuid = require('cuid'),
    restify = require('restify'),
    dbManager = require('../../dbManager'),
    actionUtils = require('../utils'),
    schemaLoader = require('is-my-json-valid/require'),
    prevHashToMeta = require('./prevHashToMeta'),

    ideaDb = dbManager.get('ideas'),
    validateJson = schemaLoader('./schema.orderly');

/**
 * @param hash String The hash to escape
 * @return String The escaped hash. `undefined` if `hash` not set.
 */
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

module.exports = function(ideaData, req, res) {

  var error ,
      writeMeta = {},
      writeStream,
      writeStreamError = undefined,

      // Ensure data passes schema validation
      validationError = actionUtils.validateParams(validateJson, ideaData);

  if (validationError) {
    error = new restify.InvalidArgumentError(validationError.message);
    return res.send(error.statusCode, error);
  }

  // The idea's ID - generate a new one if one doesn't exist
  writeMeta.key = escapeId(ideaData.id) || cuid();

  // The owner's ID
  writeMeta.owner = escapeId(ideaData.owner);

  // Generate the appropriate 'prev' data
  writeMeta.prev = prevHashToMeta(writeMeta.key, ideaData.prev || []);

  // Write the Idea data
  writeStream = ideaDb.createWriteStream(writeMeta, function(err, hash) {

    // If there was a database error, or a stream error
    // TODO: Logging when there's an error
    if (err || writeStreamError) {

      var errorMessage = "Couldn't save idea",
          error = new restify.InternalError(errorMessage);
      return res.send(error.statusCode, error);
    }

    // Success! Send back the success response
    res.json({
      id: writeMeta.key,
      hash: hash
    });

  })

  // Catch errors when trying to pipe data to the stream
  writeStream.on('error', function(err) {
    writeStreamError = err;
  });

  // Pipe the idea data into the db
  writeStream.end(JSON.stringify(ideaData.idea));

}
