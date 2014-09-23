var crypto = require('crypto');

// The Sessions Data Access Object must be constructed with a connected db object
// DAOs are models to the data in mongo db and are used to interact with the
// different collections in mongo.

function SessionsDAO(db) {
    'use strict';

    // This is a check to make sure that 'this' is not pointing to the global this
    // and is instead a SessionsDAO Object
    if (false === (this instanceof SessionsDAO)) {
        console.warn('Warning: SessionsDAO contructor called without "new" operator');
        return new SessionsDAO(db);
    }

    var sessions = db.collection('sessions');

    this.startSession = function(username, callback) {
        'use strict';

        // Generate session ID
        var currentDate = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        var sessionID = crypto.createHash('sha1').update(currentDate + random).digest('hex');

        // Create session doc
        var session = {'username' : username, '_id': sessionID };

        sessions.insert(session, function(err, result) {
            'use strict';
            if (!err) {
                callback(null, sessionID)
            } else {
                callback(err, null);
            }
        });
    }

    this.endSession = function(sessionID, callback) {
        'use strict';

        // Remove Session document
        sessions.remove({ '_id' : sessionID }, function(err, numRemoved) {
            'use strict';
            callback(err);
        });
    }
    this.getUsername = function(sessionID, callback) {
        'use strict';

        if (!sessionID) {
            console.warn("SessnionDAO.getUsername: Session not set");
            callback(Error('Session not set'), null);
            return;
        }

        sessions.findOne({ '_id': sessionID }, function(err, session) {
            'use strict';

            if (err) return callback(err, null);

            if (!session) {
                callback(new Error('Session: ' + session + ' does not exist'), null);
                return;
            }
            callback(null, session.username);
        });
    }
}

module.exports.SessionsDAO = SessionsDAO;