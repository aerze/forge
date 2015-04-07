'use strict';

// Public Modules (https://github.com/zeMirco/node-require-s--best-practices)
var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    browserify  = require('browserify-middleware');

// Project Modules (https://github.com/zemirco/node-require-s--best-practices/tree/master/require-module-files)
// This would point to ./projectmodule/index.js
// var projectModule = require('./projectmodule/');
console.log(browserify.settings.mode);
var app = new express();
app.use(morgan('dev'));

app.use('/js', browserify('./client/js/'));
app.use(express.static(path.join(__dirname + '/client')));

var port = process.env.PORT || 80;
console.log(port);
app.listen(port, function() {
    console.log('Server started');
});