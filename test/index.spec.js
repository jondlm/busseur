jest.mock('rx-http');
jest.mock('../lib/utility');
jest.useFakeTimers();
Date.now = jest.fn(() => 0);

var Rx = require('rxjs');
var strip = require('colors').stripColors;
var assert = require('assert');
var fixture = require('./fixtures/arrivals.json');
var rxHttp = require('rx-http');
var u = require('../lib/utility');

var main = require('../lib/main');

var getJsonMock = function() { return Rx.Observable.of(fixture); };
var uMock;

describe('main cli program', function() {
  beforeEach(function () {
    uMock = {
      log: jest.fn(),
      write: jest.fn(),
      die: jest.fn(),
    };

    rxHttp.getJson$.mockImplementation(getJsonMock);
    u.log.mockImplementation(uMock.log);
    u.write.mockImplementation(uMock.write);
    u.die.mockImplementation(uMock.die);
  });

  it('should correctly handle no results', function() {
    var observer = main({ stop: 0, route: [0], nickname: 'dingus' });

    assert.equal(strip(uMock.log.mock.calls[0][0]), 'dingus refreshed at 16:00');
    assert.equal(strip(uMock.log.mock.calls[1][0]), 'No results found.');
    assert(uMock.die.mock.calls.length > 0);

    observer.unsubscribe();
  });

  it('should display results with a nickname', function() {
    var observer = main({ stop: 6376, route: [35], nickname: 'grrggl' });

    assert.equal(strip(uMock.log.mock.calls[0][0]), 'grrggl refreshed at 16:00');
    assert.equal(strip(uMock.log.mock.calls[1][0]), '  #%s arriving %s at %s (%s)');
    assert.equal(strip(uMock.log.mock.calls[1][1]), '35');
    assert.equal(strip(uMock.log.mock.calls[1][2]), 'in 45 years');
    assert.equal(strip(uMock.log.mock.calls[1][3]), '04:59');
    assert.equal(strip(uMock.log.mock.calls[1][4]), 'on time');

    observer.unsubscribe();
  });

  it('should display results without a nickname', function() {
    var observer = main({ stop: 6376, route: [35] });

    assert.equal(strip(uMock.log.mock.calls[0][0]), '6376 refreshed at 16:00');
    assert.equal(strip(uMock.log.mock.calls[1][0]), '  #%s arriving %s at %s (%s)');
    assert.equal(strip(uMock.log.mock.calls[1][1]), '35');
    assert.equal(strip(uMock.log.mock.calls[1][2]), 'in 45 years');
    assert.equal(strip(uMock.log.mock.calls[1][3]), '04:59');
    assert.equal(strip(uMock.log.mock.calls[1][4]), 'on time');

    observer.unsubscribe();
  });

  it('should handle multiple routes', function() {
    var observer = main({ stop: 6376, route: [35, 77] });

    assert.equal(strip(uMock.log.mock.calls[1][1]), '35');
    assert.equal(strip(uMock.log.mock.calls[2][1]), '35');
    assert.equal(strip(uMock.log.mock.calls[3][1]), '77');

    observer.unsubscribe();
  });

  it('should handle no routes', function() {
    var observer = main({ stop: 6376, route: [] });

    assert.equal(strip(uMock.log.mock.calls[1][1]), '35');
    assert.equal(strip(uMock.log.mock.calls[2][1]), '35');
    assert.equal(strip(uMock.log.mock.calls[3][1]), '77');
    assert.equal(strip(uMock.log.mock.calls[4][1]), '99');

    observer.unsubscribe();
  });
});

