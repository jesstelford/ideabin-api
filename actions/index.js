module.exports = function(db) {
  require('./get_idea')(db);
  require('./post_idea')(db);
  require('./get_comment')(db);
  require('./post_comment')(db);
}
