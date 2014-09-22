var bcrypt = requrie('bcrypt-nodejs');

// The Users Data Access Object must be constructed with a connected db object
// DAOs are models to the data in mongo db and are used to interact with the
// different collections in mongo.

function UsersDAO(db) {
    'use strict';

    // This is a check to make sure that 'this' is not pointing to the global this
    // and is instead a UsersDAO Object
    if (false === (this instanceof UsersDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UsersDAO(db);
    }

    var users = db.collection('users');

    this.addUser = function(username, password, email, callback) {
        'use strict';

        // Generate password hash
        var salt = bcrypt.genSaltSync();
        var passwordHash = bcrypt.hashSync(password, salt);

        // Create user document
        var user = { '_id': username, 'password': passwordHash };

        // Add email if set (which it should be)
        if (email != "") {
            user['email'] = email;
        }
        users.insert(user, function (err, result) {
            'use strict';

            if (!err) {
                console.log('New user inserted');
                return callback(null, result[0]);
            }

            // Else
            return callback(err, null);
        });
    }

    this.validateLogin = function(username, password, callback) {
        'use strict';

        // Callback to pass to MOngoDB that validates a user doc
        function validateUserDoc(err, user) {
            'use strict';

            if (err) return callback(err, null);

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    callback(null, user);
                } else {
                    var invalidPasswordError = new Error('Invalid password');
                    // Set an extra field to distinguish from db error
                    invalidPasswordError.invalidPassword = true;
                    callback(invalidPasswordError, null);
                }
            } else {
                var noSuchUserError = new Error('User: ' + user + ' isn\'t real');
                // Set an extra field to distinguish from db error
                noSuchUserError.noSuchUser = true;
                callback(noSuchUser, null);
            }
        }

        users.findOne({ '_id' : username }, validateUserDoc);
    }
}

module.exports.UsersDAO = UsersDAO;