'use strict';

require('colors');

var r = require('__base');
var _ = require('lodash');
var u = require(r + 'lib/utility');
var Rx = require('rx');
var moment = require('moment');
var rxHttp = require('rx-http');
var notifier = require('node-notifier');

var BASE_URL = 'http://busseur.herokuapp.com';

module.exports = function main(opts) {
  var hasRoutes = opts.route.length > 0;

  // Use flatMap to flatten other observables
  var trimetRequest$ = Rx.Observable
    .interval(60000)
    .startWith('')
    .flatMap(function() {
      return rxHttp.getJson$(BASE_URL, {
       locIDs: opts.stop
      });
    });

  // A stream that emits an array of objects
  var arrivals$ = trimetRequest$
    .map(function(raw) {
      return _.get(raw, 'resultSet.arrival', [])
        .filter(function(a) {
          var routeCheck = hasRoutes ? _.contains(opts.route, a.route) : true;
          var dateCheck = a.estimated || a.scheduled;
          return routeCheck && dateCheck;
        })
        .map(function(a) {
          return {
            date: moment(a.estimated || a.scheduled),
            route: a.route
          };
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

  // Send OS notifications to the user if any busses are coming within the
  // given threshold
  if (!opts.disableNotifications) {
    arrivals$.subscribe(function(arrivals) {
      arrivals.forEach(function(a) {
        if (a.date.diff(moment(), 'minutes', true) <= opts.threshold) {
          notifier.notify({
            title: '#' + a.route + ' arriving',
            message: a.date.fromNow() + ' at ' + a.date.format('HH:mm')
          });
        }
      });
    });
  }

  // Returns a disposable
  return allTogetherNow$.subscribe(function(x) {

    // Clear the console - http://stackoverflow.com/a/14976765/895558
    u.write('\u001b[2J\u001b[0;0H');

    var timelineHeader = '';
    var timeline = '';
    var timelineFooter = '';
    var nickname = opts.nickname || opts.stop;

    for (var i = 0; i < x.terminalWidth; i++) {
      timelineHeader += ' ';
      timeline += '-';
      timelineFooter += ' ';
    }

    u.log((nickname + ' refreshed at ' + moment().format('HH:mm')).underline.blue);

    if (x.arrivals.length > 0) {
      x.arrivals.forEach(function(a) {
        // Draw the timeline at 100% the width of the terminal
        var minDiff = Math.round(a.date.diff(moment(), 'minutes', true));
        var scale = Math.ceil(( minDiff * x.terminalWidth ) / 30);
        var header = '#' + a.route;
        var footer = minDiff.toString() + ' min';

        timelineHeader = u.replaceAt(timelineHeader, scale, header);
        timeline = u.replaceAt(timeline, scale, '|');
        timelineFooter = u.replaceAt(timelineFooter, scale, footer);

        u.log('  #%s arriving %s at %s', a.route, a.date.fromNow(), a.date.format('HH:mm'));
      });

      u.log('\n30 min timeline');
      u.log(timelineHeader);
      u.log(timeline);
      u.log(timelineFooter);
    } else {
      u.log('No results found.');

      u.die(1);
    }

  });
};

