'use strict';

var cuid = require('cuid'),
    restify = require('restify'),
    dbManager = require('../../dbManager'),
    actionUtils = require('../utils'),
    schemaLoader = require('is-my-json-valid/require'),
    prevHashToMeta = require('./prevHashToMeta');

var ideaDb = dbManager.get('ideas'),
    validateJson = schemaLoader('./schema.orderly');

/**
 * @param id String The id to escape
 * @return String The escaped id. `undefined` if `id` not set.
 */
function escapeId(id) {
  // TODO: Implement me
  return id;
}

module.exports = function postIdeaHandler(ideaData, req, res, next) {

  var restError,
      writeMeta = {},
      writeStream,
      writeStreamError,

      // Ensure data passes schema validation
      validationError = actionUtils.validateParams(validateJson, ideaData);

  if (validationError) {
    restError = new restify.InvalidArgumentError(validationError.message);
    res.send(restError.statusCode, restError);
    return next();
  }

  // The idea's ID - generate a new one if one doesn't exist
  writeMeta.key = escapeId(ideaData.id) || cuid();

  // The owner's ID
  writeMeta.owner = escapeId(ideaData.owner);

  // Generate the appropriate 'prev' data
  writeMeta.prev = prevHashToMeta(writeMeta.key, ideaData.prev || []);

  // Write the Idea data
  writeStream = ideaDb.createWriteStream(
    writeMeta,
    function ideaWritten(err, hash) {

      var errorMessage;

      // If there was a database error, or a stream error
      // TODO: Logging when there's an error
      if (err || writeStreamError) {

        errorMessage = 'Couldn\'t save idea';
        restError = new restify.InternalError(errorMessage);

        res.send(restError.statusCode, restError);
        return next();
      }

      // Success! Send back the success response
      res.json({
        id: writeMeta.key,
        hash: hash
      });

      next();

    }
  );

  // Catch errors when trying to pipe data to the stream
  writeStream.on('error', function writeIdeaError(err) {
    writeStreamError = err;
  });

  // Pipe the idea data into the db
  writeStream.end(JSON.stringify(ideaData.idea));

};
