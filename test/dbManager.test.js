'use strict';

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

    it('does not override existing meta', function() {
      var firstDb = {foo: 'bar'},
          firstMeta = {zoo: 'zip'},
          secondDb = {foo: 'quux'},
          secondMeta = {zoo: 'abc'};
      dbManager.add('addOverideMetaTest', firstDb, firstMeta);
      dbManager.add('addOverideMetaTest', secondDb, secondMeta);
      assert.equal(dbManager.getMeta('addOverideMetaTest'), firstMeta);
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

    it('gets the added DBs meta', function() {
      var db = {},
          meta = {foo: 'bar'};
      dbManager.add('getTestMeta', db, meta);
      assert.deepEqual(dbManager.getMeta('getTestMeta'), meta);
    });
  });

});
