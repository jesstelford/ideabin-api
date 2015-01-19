'use strict';

module.exports = function requireActions() {
  require('./get_idea')();
  require('./post_idea')();
  require('./get_comment')();
  require('./post_comment')();
};
