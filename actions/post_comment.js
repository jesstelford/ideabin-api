var dispatch = require('../dispatch');

dispatch.on('action:postComment', function(req, res) {
  res.json(req.body);
});
