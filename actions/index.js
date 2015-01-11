/**
 * @param fdb Object a forkdb instance
 */
module.exports = function(fdb) {
  require('./get_idea')(fdb);
  require('./post_idea')(fdb);
  require('./get_comment')(fdb);
  require('./post_comment')(fdb);
}
