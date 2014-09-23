// The Posts Data Access Object must be constructed with a connected db object
// DAOs are models to the data in mongo db and are used to interact with the
// different collections in mongo.

function PostsDAO(db) {
    'use strict';

    // This is a check to make sure that 'this' is not pointing to the global this
    // and is instead a PostsDAO Object
    if (false === (this instanceof PostsDAO)) {
        console.log('Warning: PostsDAO constructor called without "new" operator');
        return new PostsDAO(db);
    }

    var posts = db.collection('posts');

    this.insertEntry = function(title, body, tags, author, callback) {
        'use strict';

        console.log('PostsDAO.insertEntry: Inserting new post: ' + title);

        // fix permalink to not inculde whitespace
        var permalink = title.replace( /\s/g, '_');
        permalink = permalink.replace(/\W/g, '');

        // Build a new post
        var post = {
            title: title,
            author: author,
            body: body,
            permalink: permalink,
            tags: tags,
            comments: [],
            date: new Date()
        }

        // Insert the post
        posts.insert(post, function(err, inserted) {
            'use strict';

            if (!err) {
                console.log('PostsDAO.insertEntry: Post inserted');
                callback(null, inserted[0], permalink);
            } else {
                callback(err, null);
            }
        });
    }

    this.getPosts = function(num, callback) {
        'use strict';

        posts.find().sort('date', -1).limit(num).toArray(function(err, items) {
            'use strict';

            if (!err) {
                console.log('PostDAO.getPosts: Found ' + items.length + ' posts.');
                callback(null, items);
            } else {
                callback(err, null);
            }
        });
    }

    this.getPostsByTag = function(tag, num, callback) {
        'use strict';

        posts.find({ tags: tag }).sort('date', -1).limit(num).toArray(function(err, items) {
            'use strict';

            if (!err) {
                console.log('PostDAO.getPostsByTag: Found ' + items.length + ' posts.');
                callback(null, items);
            } else {
                callback(err, null);
            }
        });
    }

    this.getPostByPermalink = function(permalink, callback) {
        'use strict';

        posts.findOne({ permalink: permalink }, function(err, post) {
            'use strict';

            if (!err) {
                console.log('PostDAO.getPostByPermalink: Found ' + items.length + ' posts.');
                callback(null, post);
            } else {
                callback(err, null);
            }
        });
    }

    this.addComment = function(permalink, name, email, body, callback) {
        'use strict';

        var comment = {
            author: name,
            body: body
        }

        if (email !== '') {
            comment['email'] = email;
        }

        posts.findOne({ permalink: permalink }, function(err, post) {
            'use strict';

            if (!err && post !== null) {
                post.comments.push(comment);

                posts.update({ '_id ': post._id }, post, function(err, updated) {
                    'use strict';

                    if (!err) {
                        callback(null, updated);
                    } else {
                        callback(err, null);
                    }
                });
            } else {
                callback(err, null);
            }
        });
    }
}

module.exports.PostsDAO = PostsDAO;