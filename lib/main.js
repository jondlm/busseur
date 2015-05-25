'use strict';

require('colors');

var r = require('__base');
var u = require(r + 'lib/utility');
var Rx = require('rx');
var moment = require('moment');
var rxHttp = require('rx-http');

var BASE_URL = 'http://127.0.0.1:3000';

module.exports = function main(opts) {
  // Use flatMap to flatten other observables
  var trimetRequest$ = Rx.Observable
    .interval(60000)
    .startWith('')
    .flatMap(function() {
      return rxHttp.getJson$(BASE_URL, {
       locIDs: opts.locid
      });
    });

  // A stream that emits an array of objects
  var arrivals$ = trimetRequest$
    .map(function(raw) {
      return raw.resultSet.arrival
        .filter(function(a) {
          return a.route === opts.route &&
                 ( a.estimated || a.scheduled );
        })
        .map(function(a) {
          return moment(a.estimated || a.scheduled);
        });
    });

  // A stream that emits the current size of the terminal
  var terminalResize$ = Rx.Observable.fromEvent(process.stdout, 'resize')
    .throttle(400)
    .startWith(null)
    .map(function() {
      return {
        width: process.stdout.columns,
        height: process.stdout.rows
      };
    });

  // A combined stream that emits objects
  var allTogetherNow$ = Rx.Observable.combineLatest(
    arrivals$,
    terminalResize$,
    function(arrivals, terminalSize) {
      return {
        arrivals: arrivals,
        terminalWidth: terminalSize.width,
        terminalHeight: terminalSize.height
      };
    });


  // Returns a disposable
  return allTogetherNow$.subscribe(function(x) {

    // Clear the console - http://stackoverflow.com/a/14976765/895558
    u.write('\u001b[2J\u001b[0;0H');

    var timeline = '';
    var timelineText = '';
    var nickname = opts.nickname || opts.locid;

    for (var i = 0; i < x.terminalWidth; i++) {
      timeline += '-';
      timelineText += ' ';
    }

    u.log((nickname + ' refreshed at ' + moment().format('HH:mm')).underline.blue);

    if (x.arrivals.length > 0) {
      x.arrivals.forEach(function(a) {
        // Draw the timeline at 100% the width of the terminal
        var minDiff = Math.round(a.diff(moment(), 'minutes', true));
        var scale = Math.ceil(( minDiff * x.terminalWidth ) / 30);
        var displayText = minDiff.toString() + ' min';

        timeline = u.replaceAt(timeline, scale, '|');
        timelineText = u.replaceAt(timelineText, scale, displayText);

        u.log('  Arriving %s at %s', a.fromNow(), a.format('HH:mm'));
      });

      u.log('\n30 min timeline');
      u.log(timeline);
      u.log(timelineText);
    } else {
      u.log('No results found.');
      u.die(0);
    }

  });
};

