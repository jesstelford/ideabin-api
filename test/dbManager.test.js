var assert = require('assert'),
    dbManager = require('../dbManager');

describe('Database Manager', function() {

  describe('.add()', function() {

    it('adds a new database', function() {
      var db = {},
          meta = {};
      dbManager.add('addTest', db, meta);
      assert(dbManager.get('addTest'));
    });

    it('adds with a default meta = {}', function() {
      var db = {};
      dbManager.add('addTestDefaultMeta', db);
      assert.deepEqual(dbManager.getMeta('addTestDefaultMeta'), {});
    });

    it('does not override an existing database', function() {
      var firstDb = {foo: 'bar'},
          secondDb = {foo: 'quux'};
      dbManager.add('addOverideTest', firstDb);
      dbManager.add('addOverideTest', secondDb);
      assert.equal(dbManager.get('addOverideTest'), firstDb);
    });

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
