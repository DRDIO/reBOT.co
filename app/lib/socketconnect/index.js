module.exports = function(config, worldobj)
{   
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Bootstrap page to handle all incoming requests
    //
    process.on('uncaughtException', function (err) {
        // Hopefully catches all rogue errors
        console.log(err.message);
        console.log(err.stack);
    });

    try {
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // Get Required Components
        //
        var connect  = require('../connect/lib/connect'),
            memory   = require('../connect/lib/middleware/session/memory'),
            socket   = require('./socketconnect'),
            redirect = require('./redirect');

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // Create a CONNECT server, add routes for a main page to start chat and a callback
        //
        // On INDEX: if no user in session, get Tumblr authorization routed to /callback
        //           otherwise, start chat server based on user name
        //
        // On CALLBACK: Authenticate with Tumblr, parse XML, store user in a session
        //
        var store  = new memory();
        var server = connect.createServer(
            function(req, res, next) {
                if (req.headers.host != config.domain) {
                    // OAuth only correctly returns if using the same domain as callback (no www)
                    var host = config.protocol + config.domain + req.originalUrl;
                    res.writeHead(303, {'Location': host});
                    res.end();
                } else {
                    next();
                }
            },
            connect.cookieParser(),
            connect.session({
                secret: config.sessionSecret,
                store: store,
                cookie: {
                    maxAge: 60000 * 60 * 12,
                    path: '/',
                    httpOnly: false
                }
            }),
            socket(function() { return server; }, store, worldobj),
            // Route oauth redirects to the redirect script
            connect.router(function(app) { redirect(config, app); }),
            // Route all public pages to the public folder
            connect.static(__dirname + '/../../../' + config.publicPath)
        );

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // Attach Socket.IO to Connect, then start listening on port 8080
        //
        server.listen(config.port, config.ipaddr);
    } catch (err) {
        console.log(err.message);
        console.log(err.stack);
    }
}