var dispatch = require('../dispatch');

dispatch.on('action:postIdea', function(req, res) {
  res.json(req.body);
});
