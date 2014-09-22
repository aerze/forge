// Public Modules (https://github.com/zeMirco/node-require-s--best-practices)
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    swig = require('swig'),
    MongoClient = require('mongodb').MongoClient; // Driven for connecting to MongoDB

// Project Modules (https://github.com/zemirco/node-require-s--best-practices/tree/master/require-module-files)
var routes = require('./routes'); // Routes for application

var app = express();

MongoClient.connect('mongodb://localhost:27017/blog', function(err, db) {

    // View Engine
    // ===================================================
    app.engine('swig', swig.renderFile);
    app.set('view engine', 'swig');
    app.set('views', path.join(__dirname, 'views'));
    // Swig caches templates instead of express, so only leave one off
    app.set('view cache', false);
    // swig.setDefaults({ cache: false });
    app.use(express.static(path.join(__dirname, 'public')));

    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(cookieParser());
    // Express middleware to populate 'req.body' so we can access POST variables
    app.use(bodyParser().json());
    app.use(bodyParser().urlencoded());

    routes(app, db);


    app.get('/', function (req, res, next) {
        console.log('\'/\' GET!');
        res.render('index', {title: 'Forge CMS'});
    });

    var server = app.listen(3000, function () {
        console.log('Listening on port ' + server.address().port );
    });
});