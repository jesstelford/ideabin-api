var dispatch = require('../../dispatch'),
    handler = require('./handler');

module.exports = function() {
  dispatch.on('action:postIdea', handler);
}
