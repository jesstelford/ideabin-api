'use strict';

var dispatch = require('../../dispatch'),
    handler = require('./handler');

module.exports = function postIdeaAction() {
  dispatch.on('action:getIdea', handler);
};
