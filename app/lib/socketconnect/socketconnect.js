// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Chat Extension variables
//
var io = require('../socketio');
    
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Create exports function to call
//
module.exports = function(serverLambda, store, worldobj) {
    var listener;
    return function (req, res, next) {
        try {
            if (!listener) {
                listener = io.listen(serverLambda());
                listener.setStore(store);
                
                // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                // Setup featured listener.chatRooms that last forever
                //
                worldobj.init();

                // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                // Form on connection callback
                //
                listener.on('connection', listener.prefixWithMiddleware(function(client, req, res) {
                    try {
                        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                        // Setup message and disconnect events
                        client.on('message', listener.dynamicMessage(worldobj));
                        client.on('disconnect', worldobj.dynamicMessage);
                    } catch (err) {
                        console.log(err.message);
                        console.log(err.stack);
                    }
                }));
            }
            next();
        } catch (err) {
            console.log(err.message);
            console.log(err.stack);
        }
    };
};

io.Listener.prototype.setStore = function(store) {
    this.store = store;
}

io.Listener.prototype.getStore = function() {
    return this.store;
}

// // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Middleware prefix for Connect stack
//
io.Listener.prototype.prefixWithMiddleware = function(fn)
{
    var self = this;
    return function (client) {
        var dummyRes = {
            writeHead: null
        };

        if (!client.request) {
            client.request = {
                url: null,
                method: null
            }
        }
        // Throw the request down the Connect middleware stack
        // so we can use Connect middleware for free.
        self.server.handle(client.request, dummyRes, function () {
            fn(client, client.request, dummyRes);
        });
    };
};

io.Listener.prototype.dynamicMessage = function(worldobj)
{
    console.log(this);
    
    return function(response) {
        try {
            for (var first in response) break;

            if (typeof response.first != 'object') {
                throw 'Invalid JSON string to call a method';
            }

            if (!(first in worldobj) || typeof worldobj[first] != 'function') {
                throw 'JSON function does not exist in world object';
            }
            
            worldobj[first](response.first);

        } catch (err) {
            console.log(err.message);
            
            if ('onMessage' in worldobj && typeof worldobj.onMessage == 'function') {
                worldobj.onMessage(response);
            } else {
                console.log('World object has no onMessage to call');
            }
        }
    }
}