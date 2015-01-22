'use strict';

var async = require('async'),
    restify = require('restify'),
    dbManager = require('../../dbManager'),
    concatStreamCallback = require('concat-stream-callback');

var ideaDb = dbManager.get('ideas');


/**
 * @param hash String The forkdb hash to get the meta data for
 * @param cb Function Called with (err <Error>, meta <Object>) Where meta has
 * the 'hash' key added
 */
function getMetaForHash(hash, cb) {

  // pull the meta out of forkdb
  return ideaDb.get(hash.hash, function ideaMetaReceived(err, meta) {

    if (err) {
      return cb(err);
    }

    // mix in the hash into the meta data
    if (meta) {
      meta.hash = hash.hash;
    }

    cb(null, meta);
  });
}

/**
 * @param heads Array An array of forkdb heads
 * @param cb Function Called with (err <Error>, metas <Array>) where metas is an
 * array of forkdb metas, including `hash`
 */
function getMetaForHeads(heads, cb) {

  // Map to get all the meta data associated with each head
  async.map(heads, getMetaForHash, cb);
}

/**
 * @param metas Array array of forkdb metas (including `hash` key)
 * @param owner String the owner to filter by
 * @return String The matching meta | null
 */
function getLatestMetaByOwner(metas, owner) {

  var result,
      metasForOwner;

  metasForOwner = metas.filter(function isOwner(meta) {
    return meta.owner === owner;
  });

  metasForOwner.forEach(function updateToLatestHead(meta) {
    // TODO: Select the latest head (how?)
    result = meta;
    return false;
  });

  return result;
}

/**
 * @param key String the forkdb key to look up
 * @param owner String TODO
 * @param cb Function Called with (err <Error>, meta <Object>) Where meta has
 * key `hash`
 */
function findHead(key, owner, cb) {

  concatStreamCallback(ideaDb.heads(key), function streamReceived(err, heads) {
    if (err) {
      return cb(err);
    }

    getMetaForHeads(heads, function headsReceived(headErr, headMetas) {

      var meta;

      if (headErr) {
        return cb(headErr);
      }

      meta = getLatestMetaByOwner(headMetas, owner);

      if (!meta) {
        // TODO: Why is this error
        cb(new Error('Couldn\'t find owner associated with key `' + key + '`'));
      } else {
        cb(null, meta);
      }
    });

  });
}

/**
 * @param hash String the hash to get the idea of
 * @param cb Function Called with (err <Error>, blob <String>)
 */
function getIdea(hash, cb) {
  concatStreamCallback(ideaDb.createReadStream(hash), {encoding: 'string'}, cb);
}

/**
 * @param hash String The hash of the idea we want to return
 * @param res Object The Response object
 * @return Function (err <Error>, blob <String>) Calls `res.send(err)` on
 * failure (with the err), or `res.json` on Success to send the data to the
 * request.
 */
function ideaProcessor(hash, res) {
  return function processIdea(err, blob) {

    var errorMessage,
        error;

    if (err) {
      errorMessage = 'Could not load idea with hash `' + hash + '`';
      error = new restify.InternalError(errorMessage);

      return res.send(error.statusCode, error);
    }

    res.json(JSON.parse(blob));
  };
}

module.exports = function getIdeaHandler(id, owner, version, req, res) {

  if (version) {
    // A specific has version is already known
    getIdea(version, ideaProcessor(version, res));

  } else {
    // No particular hash version was requested

    findHead(id, owner, function headFound(err, meta) {

      var errorMessage,
          error;

      if (err) {
        errorMessage = 'Could not load idea with id `' +
          id +
          '`, owner `' +
          owner +
          '`';
        error = new restify.InternalError(errorMessage);

        return res.send(error.statusCode, error);
      }

      getIdea(meta.hash, ideaProcessor(meta.hash, res));

    });
  }

};
