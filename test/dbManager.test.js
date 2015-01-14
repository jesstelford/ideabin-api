var assert = require('assert'),
    dbManager = require('../dbManager');

describe('Database Manager', function() {

  describe('.add()', function() {

  });

  describe('.get()', function() {

    it('has default databases', function() {
      assert(dbManager.get('ideas'));
      assert(dbManager.get('comments'));
      assert(dbManager.get('tags'));
    });

    it('returns undefined when not found', function() {
      assert.equal(dbManager.get('qwerty'), undefined);
    });

  });

  describe('.getMeta()', function() {

  });

});
