/*eslint no-underscore-dangle:0 */

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
      die: sinon.spy(),
      notify: sinon.spy()
    };

    main.__set__('rxHttp.getJson$', getJsonMock);
    main.__set__('u.log', uMock.log);
    main.__set__('u.write', uMock.write);
    main.__set__('u.die', uMock.die);
    main.__set__('notifier.notify', uMock.notify);
  });

  afterEach(function () { clockMock.restore(); });

  it('should correctly handle no results', function() {
    var observer = main({ stop: 0, route: [0], nickname: 'dingus' });

    assert.equal(strip(uMock.log.getCall(0).args[0]), 'dingus refreshed at 16:00');
    assert.equal(strip(uMock.log.getCall(1).args[0]), 'No results found.');
    assert.equal(uMock.die.called, true);

    observer.dispose();
  });

  it('should display results with a nickname', function() {
    var observer = main({ stop: 6376, route: [35], nickname: 'grrggl' });

    assert.equal(strip(uMock.log.getCall(0).args[0]), 'grrggl refreshed at 16:00');
    assert.equal(strip(uMock.log.getCall(1).args[0]), '  #%s arriving %s at %s (%s)');
    assert.equal(strip(uMock.log.getCall(1).args[1]), '35');
    assert.equal(strip(uMock.log.getCall(1).args[2]), 'in 45 years');
    assert.equal(strip(uMock.log.getCall(1).args[3]), '04:59');
    assert.equal(strip(uMock.log.getCall(1).args[4]), 'on time');

    observer.dispose();
  });

  it('should display results without a nickname', function() {
    var observer = main({ stop: 6376, route: [35] });

    assert.equal(strip(uMock.log.getCall(0).args[0]), '6376 refreshed at 16:00');
    assert.equal(strip(uMock.log.getCall(1).args[0]), '  #%s arriving %s at %s (%s)');
    assert.equal(strip(uMock.log.getCall(1).args[1]), '35');
    assert.equal(strip(uMock.log.getCall(1).args[2]), 'in 45 years');
    assert.equal(strip(uMock.log.getCall(1).args[3]), '04:59');
    assert.equal(strip(uMock.log.getCall(1).args[4]), 'on time');

    observer.dispose();
  });

  it('should handle multiple routes', function() {
    var observer = main({ stop: 6376, route: [35, 77] });

    assert.equal(strip(uMock.log.getCall(1).args[1]), '35');
    assert.equal(strip(uMock.log.getCall(2).args[1]), '35');
    assert.equal(strip(uMock.log.getCall(3).args[1]), '77');

    observer.dispose();
  });

  it('should handle no routes', function() {
    var observer = main({ stop: 6376, route: [] });

    assert.equal(strip(uMock.log.getCall(1).args[1]), '35');
    assert.equal(strip(uMock.log.getCall(2).args[1]), '35');
    assert.equal(strip(uMock.log.getCall(3).args[1]), '77');
    assert.equal(strip(uMock.log.getCall(4).args[1]), '99');

    observer.dispose();
  });

  it('should notify when threshold is high enough', function() {
    var observer = main({ stop: 6376, route: [], threshold: 999999999 });

    assert.equal(uMock.notify.called, true);

    observer.dispose();
  });

  it('should not notify when threshold is low', function() {
    var observer = main({ stop: 6376, route: [], threshold: 1 });

    assert.equal(uMock.notify.called, false);

    observer.dispose();
  });
});

