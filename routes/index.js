var SessionHandler = require('./session'),
    ContentHandler = require('./content'),
    ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var sessionHandler = new SessionHandler(db),
        contentHandler = new ContentHandler(db);

    // Middleware to see if a use is logged in
    app.use(sessionHandler.isLoggedInMiddleware);

    // The main page
    app.get('/', contentHandler.displayMainPage);

    // Main page filtered by tag
    app.get('/tag/:tag', contentHandler.displayMainPageByTag);

    // A single post
    app.get('/post/:permalink', contentHandler.displayPostByPermalink);
    app.post('/newComment', contentHandler.handleNewComment);
    app.get('/postNotFound', contentHandler.displayPostNotFound);
    
    // Add new post form
    app.get('/newpost', contentHandler.displayNewPage);
    app.post('/newpost', contentHandler.handleNewPost);

    // Login Form
    app.get('/login', sessionsHandler.displayLoginPage);
    app.post('/login', sessionHandler.handleLoginRequest);

    // Logout Page
    app.get('/logout', sessionHandler.displayLogoutPage);
    
    // Welcome Page
    app.get('/welcome', sessionHandler.displayWelcomePage);
    
    // Signup Form
    app.get('/signup', sessionHandler.displaySignupPage);
    app.post('/signup', sessionHandler.handleSignup);

    // Error handling middleware
    app.use(ErrorHandler);
}