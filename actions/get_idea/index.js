var async = require('async'),
    restify = require('restify'),
    dispatch = require('../../dispatch'),
    dbManager = require('../../dbManager'),
    actionUtils = require('../utils'),
    concatStream = require('concat-stream'),

    ideaDb = dbManager.get('ideas');

/**
 * @param key String the forkdb key to look up
 * @param owner String TODO
 * @param cb Function Called with (err <Error>, hash <String>)
 */
function findHead(key, owner, cb) {
  var readStream = ideaDb.heads(key)

  readStream.on('error', cb);

  console.log("finding head for ", key, owner);
  readStream.pipe(concatStream(function(heads) {

    function filterByOwner(meta) {
      return meta.owner == owner;
    }

    function hashToMetaMapper(hash, cb) {

      // pull the hash out of forkdb
      return ideaDb.get(hash.hash, function(err, meta) {

        // mix in the hash into the meta data
        if (!err && meta) {
          meta.hash = hash.hash;
        }

        // call the original callback
        cb(err, meta);
      });
    }

    console.log('found heads', heads);

    // Map to get all the meta data associated with each head
    async.map(heads, hashToMetaMapper, function (err, headMetas) {

      console.log('found heads meta', headMetas);

      var hash,
          headMetasForOwner;

      headMetasForOwner = headMetas.filter(filterByOwner);

      console.log('filtered heads meta', headMetasForOwner);

      headMetasForOwner.forEach(function(head) {
        // TODO: Select the latest head (how?)
        hash = head.hash;
        return false;
      });

      console.log('got hash', hash);

      if (!hash) {
        // TODO: Why is this error
        cb(new Error('Couldn\'t find owner associated with key `' + key + '`'));
      } else {
        cb(null, hash);
      }
    });

  }));
}

/**
 * @param hash String the hash to get the idea of
 * @param cb Function Called with (err <Error>, blob <String>)
 */
function getIdea(hash, cb) {

  var readStream = ideaDb.createReadStream(hash);

  readStream.on('error', cb);

  readStream.pipe(concatStream({encoding: 'string'}, function(blob) {
    cb(null, blob);
  }));
}

/**
 * @param hash String The hash of the idea we want to return
 * @param res Object The Response object
 * @param next Function The Restify next() function
 * @return Function (err <Error>, blob <String>) Calls `next` on failure (with
 * the err), or `res.json` on Success to send the data to the request.
 */
function ideaProcessor(hash, res, next) {
  return function processIdea(err, blob) {
    if (err) {
      var errMessage = 'Could not load idea with hash `' + hash + '`';
      return next(new restify.InternalError(errMessage));
    }

    res.json(JSON.parse(blob));
  }
}

module.exports = function() {

  dispatch.on('action:getIdea', function(id, owner, version, req, res, next) {

    if (version) {
      // A specific has version is already known
      getIdea(version, ideaProcessor(version, res, next));

    } else {
      // No particular hash version was requested

      findHead(id, owner, function(err, hash) {

        if (err) {
          var errMessage = 'Could not load idea with id `' + id + '`, owner `' + owner + '`';
          return next(new restify.InternalError(errMessage));
        }

        getIdea(hash, ideaProcessor(hash, res, next));

      });
    }

  });

}
