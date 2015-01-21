'use strict';

var sinon = require('sinon'),
    assert = require('assert'),
    Writable = require('stream').Writable,
    proxyquire = require('proxyquire');

var postIdea,
    dbManagerStub;


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

  before('mock requires', function() {

    dbManagerStub = {
      get: function() {
        return {
          createWriteStream: function(data, callback) {

            // emulate async Writable
            process.nextTick(function() {
              callback(new Error('a test error'));
            });

            return new Writable();
          }
        };
      }
    };

    postIdea = proxyquire('../../../actions/post_idea/handler', {
      '../../dbManager': dbManagerStub
    });

  });

  after('clean up mocks', function() {
    dbManagerStub = {};
  });

  it('throws an error on failed write to DB', function(done) {
    // See actions/post_idea/schema.orderly
    var ideaData = {
        idea: {
          name: 'foo'
        },
        owner: 'jess'
      };

    testPost(ideaData, function(req, res) {

      assert.equal(res.json.callCount, 0);
      assert.equal(res.send.callCount, 1);
      assert.equal(res.send.args[0][0], 500);
      assert.equal(res.send.args[0][1].message, 'Couldn\'t save idea');
      done();

    });

  });

});
