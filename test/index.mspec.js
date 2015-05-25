'use strict';

var r = require('__base');
var Rx = require('rx');
var sinon = require('sinon');
var strip = require('colors').stripColors;
var rewire = require('rewire');
var assert = require('assert');
var fixture = require(r + 'test/fixtures/arrivals.json');

var main = rewire(r + 'lib/main');

var getJsonMock = function() { return Rx.Observable.just(fixture); };
var uMock;
var clockMock;


describe('main cli program', function() {
  beforeEach(function () {
    clockMock = sinon.useFakeTimers();
    uMock = {
      log: sinon.spy(),
      write: sinon.spy(),
      die: sinon.spy()
    };

    main.__set__('rxHttp.getJson$', getJsonMock);
    main.__set__('u.log', uMock.log);
    main.__set__('u.write', uMock.write);
    main.__set__('u.die', uMock.die);
  });

  afterEach(function () { clockMock.restore(); });

  it('should correctly handle no results', function() {
    var observer = main({ locid: 0, route: 0, nickname: 'dingus' });

    assert.equal(strip(uMock.log.getCall(0).args[0]), 'dingus refreshed at 16:00');
    assert.equal(strip(uMock.log.getCall(1).args[0]), 'No results found.');
    assert.equal(uMock.die.called, true);

    observer.dispose();
  });

  it('should display results with a nickname', function() {
    var observer = main({ locid: 6376, route: 35, nickname: 'grrggl' });

    assert.equal(strip(uMock.log.getCall(0).args[0]), 'grrggl refreshed at 16:00');
    assert.equal(strip(uMock.log.getCall(1).args[0]), '  Arriving %s');
    assert.equal(strip(uMock.log.getCall(1).args[1]), 'in 45 years');

    observer.dispose();
  });

  it('should display results without a nickname', function() {
    var observer = main({ locid: 6376, route: 35 });

    assert.equal(strip(uMock.log.getCall(0).args[0]), '6376 refreshed at 16:00');
    assert.equal(strip(uMock.log.getCall(1).args[0]), '  Arriving %s');
    assert.equal(strip(uMock.log.getCall(1).args[1]), 'in 45 years');

    observer.dispose();
  });
});


