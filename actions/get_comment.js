var dispatch = require('../dispatch');

dispatch.on('action:getComment', function(req, res) {
  res.json(req.params);
});
