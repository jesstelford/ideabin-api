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

  it('saves to database', function(done) {
    var ideaData = {
        idea: {
          name: 'foo'
        },
        owner: 'jess'
      };

    testPost(ideaData, function(req, res) {

      assert.equal(res.send.callCount, 0);
      assert.equal(typeof res.json.args[0][0], 'object');
      done();

    });

  });

});
