var restify = require('restify'),
    dispatch = require('../../dispatch'),
    dbManager = require('../../dbManager');

function validId(id) {
  // TODO: Better checking for valid cuid()
  return !!id;
}

module.exports = function() {

  var ideaDb = dbManager.get('ideas');

  dispatch.on('action:getIdea', function(ideaId, req, res, next) {

    // Check required ID is valid
    if (!validId(ideaId)) {
      return next(new restify.InvalidArgumentError('`id` must be a valid Idea ID'));
    }





    // Write the Idea data
    ideaDb
      .createReadStream(writeMeta, function(err, hash) {

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
