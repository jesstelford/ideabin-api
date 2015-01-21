'use strict';

var sinon = require('sinon'),
    assert = require('assert'),
    postIdea = require('../../actions/post_idea/handler'),
    dbManager = require('../../dbManager'),
    concatStreamCallback = require('concat-stream-callback');

function testPost(ideaData, callback) {

  var req = {},
      res = {
        send: sinon.spy(),
        json: sinon.spy()
      };

  postIdea(ideaData, req, res, function() {
    var args = [req, res].concat(arguments);
    callback.apply(this, args);
  });

}

describe('POST idea', function() {

  it('responds with json object', function(done) {
    var ideaData = {
        idea: {
          name: 'foo'
        },
        owner: 'jess'
      };

    testPost(ideaData, function(req, res) {

      assert.equal(res.send.callCount, 0);
      assert.equal(typeof res.json.args[0][0], 'object');
      assert.equal(typeof res.json.args[0][0].id, 'string');
      assert.equal(typeof res.json.args[0][0].hash, 'string');
      done();

    });

  });

  it('throws a validation error', function(done) {
    // See actions/post_idea/schema.orderly
    var ideaData = {
        owner: 'jess'
      };

    testPost(ideaData, function(req, res) {

      assert.equal(res.json.callCount, 0);
      assert.equal(res.send.callCount, 1);
      assert.equal(res.send.args[0][0], 409);
      assert.equal(res.send.args[0][1].message, '`idea` is required');
      done();

    });

  });

  it('writes correct parts to correct DBs', function(done) {

    var ideaDb = dbManager.get('ideas'),
        // See actions/post_idea/schema.orderly
        ideaData = {
          idea: {
            name: 'bar'
          },
          owner: 'jess'
        };

    testPost(ideaData, function(req, res) {

      var hash = res.json.args[0][0].hash;
      var key = res.json.args[0][0].id;

      // The main idea data should exist as the forkdb blob
      concatStreamCallback(
        ideaDb.createReadStream(hash),
        {encoding: 'string'},
        function (readErr, blob) {

          if (readErr) { throw readErr; }
          assert.deepEqual(JSON.parse(blob), ideaData.idea);

          // The meta data is stored in the meta section of forkdb
          ideaDb.get(hash, function(metaErr, meta) {
            if (metaErr) { throw metaErr; }
            assert.deepEqual(meta, {
              key: key,
              owner: ideaData.owner,
              prev: []
            });
            done();
          });
        }
      );

    });

  });

});
