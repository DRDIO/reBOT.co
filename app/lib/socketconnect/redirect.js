var url    = require('url'),
    fs     = require('fs'),
    xml2js = require('../xml2js'),
    oauth  = require('../oauth');

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Redirect from oauth, build tumblr account and pass into session
//
module.exports = function(config, app)
{
    var oa = new oauth.OAuth(config.requestUrl, config.accessUrl, config.consumerKey, config.consumerSecret, '1.0', config.callbackUrl, 'HMAC-SHA1');
    
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Callback Page (Parse XML from Tumblr Authenticate, store user in session, redirect to index)
    //
    app.get(config.callbackRelUrl, function(req, res)
    {
        var parsedUrl = url.parse(req.url, true);

        if ('query' in parsedUrl && typeof parsedUrl.query == 'object' && 'oauth_token' in parsedUrl.query) {
            oa.getOAuthAccessToken(parsedUrl.query.oauth_token, req.session.secret, parsedUrl.query.oauth_verifier, function(error, token, secret, results)
            {
                // Get Authentication Information
                oa.getProtectedResource(config.authenticateUrl, 'POST', token, secret, function(error, data)
                {
                    // Make sure we get actual data
                    if (typeof data == 'string') {
                        var parser = new xml2js.Parser();

                        // Setup XML parser
                        parser.addListener('end', function(result)
                        {
                            if ('tumblelog' in result) {
                                // Multiple versus single accounts (always get primary)
                                var tumblr = (0 in result['tumblelog'] ? result['tumblelog'][0] : result['tumblelog']);

                                // Gather user data and store in a session variable
                                if ('@' in tumblr && 'name' in tumblr['@']) {
                                    req.session.user = {
                                        'name':   tumblr['@']['name'],
                                        'title':  tumblr['@']['title'],
                                        'url':    tumblr['@']['url'],
                                        'avatar': tumblr['@']['avatar-url']
                                    }

                                    // Redirect to home and start socket
                                    res.writeHead(303, {'Location': config.indexRelUrl});
                                    res.end();
                                }
                            }
                        });
                        
                        // Start actual parse
                        parser.parseString(data);
                    } else {
                        var message = (error.data || 'Invalid response from Tumblr') + ' (C2).';
                        res.writeHead(200, {'Content-type': 'text/html'});
                        res.end(message);
                    }
                });
            });
        } else {
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end('The callback did not conntain a login key (C1).');
        }
    });

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Clear out user and refresh entire session
    //
    app.get(config.clearRelUrl, function(req, res) {
        delete req.session;
        
        res.writeHead(303, {'Location': config.indexRelUrl});
        res.end();
    });

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Index Page (If user exists, start chat)
    //
    app.get(config.indexRelUrl, function(req, res)
    {
        try {
            if ('session' in req) {
                if (!('user' in req.session)) {
                    // Store the page for when callback occurs
                    req.session.page = req.params.page || '';

                    oa.getOAuthRequestToken(function(error, token, secret, results)
                    {
                        req.session.secret = secret;
                        res.writeHead(303, {'Location': config.authorizeUrl + '?oauth_token=' + token});
                        res.end();
                    });
                } else {
                    fs.readFile(__dirname + '/../../../' + config.publicPath + '/' + config.indexPage, function(err, data) {
                        if (!err) {
                            res.writeHead(200, {'Content-type': 'text/html'});
                            res.end(data || '');
                        }
                    });
                }
            } else {
                throw 'no session in this request!';
            }
        } catch(err) {
            console.log(err.message);
            console.log(err.stack);

            res.writeHead(200, {'Content-type': 'text/html'});
            res.end('Unable to redirect TumblrChat (R1).');
        }
    });
}