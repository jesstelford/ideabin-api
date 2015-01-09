var dispatch = require('../dispatch');

dispatch.on('action:getIdea', function(req, res) {
  res.json(req.params);
});
