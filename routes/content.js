var PostsDAO = require('../DAOs/PostsDAO'),
    sanitize = require('validator').sanitize;

// The ContentHandler must be contructor with a connected DB
function ContentHandler (db) {
    'use strict';

    var posts = new PostsDAO(db);

    this.displayMainPage = function(req, res, next) {
        'use strict';

        posts.getPosts(10, function(err, results) {
            'use strict';

            if (err) return next(err);

            return res.render('blogTemplate', {
                title: 'Blog Homepage',
                username: req.username,
                myposts: results
            });
        });
    }

    this.displayMainPageByTag = function(req, res, next) {
        'use strict';

        var tag = req.params.tag;

        posts.getPostsByTag(tag, 10, function(err, results) {
            'use strict';

            if (err) return next(err);

            return res.render('blogTemplate', {
                title: 'Blog Homepage',
                username: req.username,
                myposts: results
            });
        });
    }

    this.displayPostByPermalink = function(req, res, next) {
        'use strict';

        var permalink = req.params.permalink;

        posts.getPostByPermalink(permalink, function(err, post) {
            'use strict';

            if (err) return next(err);

            if (!post) return res.redirect('/postNotFound');

            // create comment form fields for additional comment
            var comment = {
                name: req.username,
                body: '',
                email: ''
            }

            return res.render('entryTemplate', {
                title: 'Blog post',
                username: req.username,
                post: post,
                comment: comment,
                errors: ''
            });
        });
    }

    this.handleNewComment = function(req, res, next) {
        'use strict';

        var name = req.body.commentName,
            email = req.body.commentEmail,
            body = req.body.commentBody,
            permalink = req.body.permalink;

        //  Overide the comment with actual username if found
        if (req.username) {
            name = req.username;
        }

        if (!name || !body) {
            // User did not fill in enough information
            posts.getPostByPermalink(permalink, function(err, post) {
                'use strict';

                if (err) return next(err);

                if (!post) return res.redirect('/postNotFound');

                // create comment form fields for additional comment
                var comment = {
                    name: name,
                    body: '',
                    email: ''
                }

                var errors = 'Post must contain your name and a comment!';
                return res.render( 'entryTemplate', {
                    title: 'Blog Post',
                    username: req.username,
                    post: post,
                    comment: comment,
                    errors: errors
                });
            });

            return;
        }

        // Post comment even if user is not logged in
        posts.addComment(permalink, name, email, body, function(err, updated) {
            'use strict';

            if (err) return next(err);

            if (updated === 0) return res.redirect('/postNotFound');

            return res.redirect('/post/' + permalink);
        });
    }

    this.displayPostNotFound = function(req, res, next) {
        'use strict';
        return res.send('Sorry, post not found', 404);
    }

    this.displayNewPostPage = function (req, res, next) {
        'use strict';

        if (!req.username) return res.redirect('/login');

        return res.render( 'newPostTemplate', {
            subject: '',
            body: '',
            errors: '',
            tags: '',
            username: req.username
        });
    }

    
}