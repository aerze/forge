// Public Modules (https://github.com/zeMirco/node-require-s--best-practices)
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

// Project Modules (https://github.com/zemirco/node-require-s--best-practices/tree/master/require-module-files)
// This would point to ./projectmodule/index.js
// var projectModule = require('./projectmodule/');

var app = express();

app.get('/', function (req, res, next) {
    console.log('request made at \'/\'');
    res.send("hello world!");
});

var server = app.listen(3000, function () {
    console.log('Listening on port ' + server.address().port );
});