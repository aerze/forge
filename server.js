// Public Modules (https://github.com/zeMirco/node-require-s--best-practices)
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    swig = require('swig');

// Project Modules (https://github.com/zemirco/node-require-s--best-practices/tree/master/require-module-files)
// This would point to ./projectmodule/index.js
// var projectModule = require('./projectmodule/');

var app = express();


// View Engine
// ===================================================
app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', __dirname + '/views');
// Swig caches templates instead of express, so only leave one off
app.set('view cache', false);
// swig.setDefaults({ cache: false });

// Express middleware to populate 'req.cookies' so we can access cookies
app.use(express.cookieParser());
// Express middleware to populate 'req.body' so we can access POST variables
app.use(express.bodyParser());



app.get('/', function (req, res, next) {
    console.log('request made at \'/\'');
    res.render('index', {title: 'Forge CMS'});
    // res.send("hello world!");
});

var server = app.listen(3000, function () {
    console.log('Listening on port ' + server.address().port );
});