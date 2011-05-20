// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Chat Extension variables
//
var io = require('../socketio');


io.Listener.prototype.setStore = function(store) {
    this.store = store;
}

io.Listener.prototype.getStore = function() {
    return this.store;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
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

io.Listener.prototype.dynamicReceive = function(worldobj)
{
    return function(response) 
    {
        try {
            for (var first in response) break;

            if (typeof response[first] != 'object') {
                throw 'Invalid JSON string to call a method';
            }

            if (!(first in worldobj) || typeof worldobj[first] != 'function') {
                throw 'JSON function does not exist in world object';
            }

            worldobj[first].apply(this, response[first]);

        } catch (err) {
            console.log(err);

            if ('onMessage' in worldobj && typeof worldobj.onMessage == 'function') {
                worldobj.onMessage(response);
            } else {
                console.log('World object has no onMessage to call');
            }
        }
    }
}

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
                if ('init' in worldobj && typeof worldobj.init == 'function') {
                    worldobj.init.apply(listener);
                }

                // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                // Form on connection callback
                //
                listener.on('connection', listener.prefixWithMiddleware(function(client, req, res) {
                    try {
                        
                        if ('connect' in worldobj && typeof worldobj.connect == 'function') {
                            worldobj.connect.apply(client);
                        }
                        
                        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
                        // Setup message and disconnect events
                        client.on('message', listener.dynamicReceive(worldobj));

                        if ('disconnect' in worldobj && typeof worldobj.disconnect == 'function') {
                            client.on('disconnect', worldobj.disconnect);
                        }
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
