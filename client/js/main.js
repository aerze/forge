'use strict';

var page    = require('page');

var log     = require('./log')('Bootup');
var routes  = require('./routes');

page('*', routes.init);
page('/', routes.home);
page.start({hashbang: true});

log('complete');