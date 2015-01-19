'use strict';

/**
 * @param key String The key to add
 * @param arr Array The array of previous hashes to process
 * @return Array [ { key: '<the key>', hash: '<the hash>' } ]
 */
module.exports = function prevHashToMeta(key, arr) {
  return arr.map(function hashToObject(prev) {
    return {
      key: key,
      hash: prev
    };
  });
};
