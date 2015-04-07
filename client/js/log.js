'use strict';

var Log  = function (file) {
    var log = function (string) {
        console.log('%c' + file + ' -> \t' + string, 'color: #5DD9C1;');    
    };
    return log;
};

module.exports = Log;