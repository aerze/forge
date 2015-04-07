'use strict';

var log = require('../log')('Routes');

var Routes = {
    init: function(req, next) {
        console.log(req.init);
        req.init = false;
        next();
    },

    home: function(req) {
        console.log(req.init);
        log(req.path);
    }
};

module.exports = Routes;