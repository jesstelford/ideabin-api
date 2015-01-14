/**
 * @param key String The key to add
 * @param arr Array The array of previous hashes to process
 * @return Array [ { key: '<the key>', hash: '<the hash>' } ]
 */
module.exports = function(key, arr) {
  return arr.map(function(prev) {
    return {
      key: key,
      hash: prev
    }
  });
}
