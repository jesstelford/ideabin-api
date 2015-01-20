'use strict';

var sinon = require('sinon'),
    assert = require('assert'),
    postIdea = require('../../actions/post_idea/handler');

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

});
