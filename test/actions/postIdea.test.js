'use strict';

var sinon = require('sinon'),
    assert = require('assert'),
    postIdea = require('../../actions/post_idea/handler');

describe('POST idea', function() {

  it('saves to database', function(done) {
    var ideaData = {
        idea: {
          name: 'foo'
        },
        owner: 'jess'
      },
      req = {},
      res = {
        send: sinon.spy(),
        json: sinon.spy()
      };

    postIdea(ideaData, req, res, function() {

      assert.equal(res.send.callCount, 0);
      assert.equal(typeof res.json.args[0][0], 'object');
      done();

    });

  });

});
