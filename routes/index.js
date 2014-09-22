var SessionHandler = require('./session'),
    ContentHandler = require('./content'),
    ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var sessionHandler = new SessionHandler(db),
        contentHandler = new ContentHandler(db);

    app.use(sessionHandler.isLoggedInMiddleware);
}