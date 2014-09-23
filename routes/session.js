var UsersDAO = require('../DAOs/users').UsersDAO,
    SessionsDAO = require('../DAOs/sessions').SessionsDAO;
    // A session Data Access Object, a model
    // The session handler must be constructed with a connected DB

function SessionHandler (db) {
    "use strict";

    var users = new UsersDAO(db);
    var sessions = new SessionsDAO(db);

    this.isLoggedInMiddleware = function(req, res, next) {
        var sessionID = req.cookies.session;

        sessions.getUsername(sessionID, function(err, username) {
            'use strict';

            if (!err && username) {
                req.username = username;
            }
            return next();
        });
    }

    this.displayLoginPage = function(req, res, next) {
        'use strict';
        return res.render('login', { username:'', password:'', loginError: ''});
    }

    this.handleLoginRequest = function(req, res, next) {
        'use strict';

        var username = req.body.username,
            password = req.body.password;

        users.validateLogin(username, password, function(err, user) {
            'use strict';

            if (err) {
                if (err.noSuchUser) {
                    return res.render('login', {
                        username: username,
                        password: '',
                        loginError: 'No Such User'
                    });
                } else if (err.invalidPassword) {
                    return res.render('login', {
                        username: username,
                        password: '',
                        loginError: 'Invalid password'
                    });
                } else {
                    // Some other error
                    return next(err);
                }
            }

            sessions.startSession(user['_id'], function(err, sessionID) {
                'use strict';

                if (err) return next(err);

                res.cookie('session', sessionID);
                return res.redirect('/welcome');
            });
        });
    }

    this.displayLogoutPage = function(req, res, next) {
        'use strict';

        var sessionID = req.cookies.session;
        sessions.endSession(sessionID, function(err) {
            'use strict';

            // Even if the user wasn't logged in, return to home
            res.cookie('session', '');
            return res.redirect('/');
        });
    }

    this.displaySignupPage = function(req, res, next) {
        'use strict';

        res.render('signup', {
            username: '',
            password: '',
            passwordError: '',
            usernameError: '',
            emailError: '',
            verifyError: ''
        });
    }

    function validateSignup( username, password, verify, email, errors) {
        'use strict';

        var USER_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
        var PASS_REGEX = /^.{3,20}$/;
        var EMAIL_REGEX = /^[\S]+@[\S]+\.[\S]+$/;

        errors['usernameError'] = '';
        errors['passwordError'] = '';
        errors['emailError'] = '';
        errors['verifyError'] = '';

        if (!USER_REGEX.test(username)) {
            errors['usernameError'] = 'Invalid Username. Try just letters and numbers';
            return false;            
        }
        if (!PASS_REGEX.test(password)) {
            errors['passwordError'] = 'Invalid Password.';
            return false; 
        }
        if (password != verify) {
            errors['verifyError'] = 'Passwords don\'t match';
            return false;
        }
        if (email != '') {
            if (!EMAIL_REGEX.test(email)) {
                errors['emailError'] = 'Invalid Email Address';
                return false;
            }
        }
        return true;
    }

    this.handleSignup = function(req, res, next) {
        'use strict';

        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var verify = req.body.verify;

        // Set these up in case we have an error case
        var errors = {
            username: username,
            email: email
        }
        if (validateSignup(username, password, verify, email, errors)) {
            users.addUser(username, password, email, function(err, user) {
                'use strict';

                if (err) {
                    // Duplicate error
                    if (err.code == '11000') {
                        errors['usernameError'] = 'Username already exists, please choose another';
                        return res.render('signup', errors);
                    } else {
                    // Some other error
                        return next(err);
                    }
                }

                sessions.startSession(user['_id'], function(err, sessionID) {
                    'use strict';

                    if (err) return next(err);

                    res.cookie('session', sessionID);
                    return res.redirect('/welcome');
                });
            });
        } else {
            console.log('SessionHandler.handleSignup: User didn\'t validate');
            return res.render('signup', errors);
        }
    }

    this.displayWelcomePage = function(req, res, next) {
        'use strict';
        
        if (!req.username) {
            console.log('SessionHandler.displayWelcomePage: Can\'t identify user, redircting to signup');
            return res.redirect('/signup');
        }

        return res.render('welcome', {
            username: res.username
        });
    }
}

module.exports = SessionHandler;