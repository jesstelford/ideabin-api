'use strict';

// A global event dispatcher
var events = require('events');
module.exports = new events.EventEmitter();
