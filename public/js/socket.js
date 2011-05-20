var BOOTSTRAP = (function(self)
{
    self.socketio = {};
    self.socket   = {
        approved: false,
        timeoutId: null,
        attempts: 0
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // INIT: Create socket object, setup listener events, and connect for first time
    //
    self.initSocket = function() 
    {
        console.log('initializing');
        
        self.socketio = new io.Socket(null, {rememberTransport: false});

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // CONNECT: As soon as we connect, send credentials. Chat is still disabled at this time.
        //
        self.socketio.on('connect', function()
        {
            console.log('connected');
            
            self.socketSend('init', self.cookieRead('connect.sid'));

            // Clear reconnect timeout and set to 0 for attempts
            clearTimeout(self.socket.timeoutId);
            self.socket.attempts = 0;
        });

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // DISCONNECT: Attempt to reconnect immediately
        //
        self.socketio.on('disconnect', function()
        {
            self.socket.approved = false;
            self.socketConnect();
        });

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // MESSAGE: Process a response from the server based on onMessages methods
        //
        self.socketio.on('message', function(response)
        {
            try {
                for (var first in response) break;

                if (typeof response[first] != 'object') {
                    throw 'Invalid JSON string to call a method';
                }

                if (!(first in self) || typeof self[first] != 'function') {
                    throw 'JSON function does not exist in world object';
                }

                self[first](response[first]);
            } catch (err) {
                console.log(err);
                console.log('Unable to find proper method');
            }
        });

        self.socketConnect();
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // SOCKETCONNECT: Setup and attempt to connect to the server
    //
    self.socketConnect = function() {
        console.log('connecting');
        
        if (typeof self.socketio != 'undefined') {
            // Try connecting 3 times (reset to 0 on successful connect)
            if (self.socket.attempts < 3) {
                if (!self.socketio.connecting && !self.socketio.connected) {
                    self.socket.attempts++;
                    self.socketio.connect();
                }

                // Check back after timeout for another attempt
                clearTimeout(self.socket.timeoutId);
                self.socket.timeoutId = setTimeout(self.socketConnect,
                    self.socketio.options.connectTimeout);
            } else {
                self.socketRestart({
                    message: 'We were unable to connect you after ' + self.socket.attempts + ' attempts (T1).'
                });
            }
        } else {
            self.socketRestart({
                message: 'No socket connection exists (T2).'
            });
        }
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // SOCKETRESTART: As soon as we connect, send credentials. Chat is still disabled at this time.
    //
    self.socketRestart = function(response)
    {
        // Add detailed messages on errors
        self.cookieErase('connect.sid');

        var message = response.message || 'There was an unknown error (E0)';
        if (confirm(message + '\nWould you like to restart reBot.co?')) {
            location.href = '/clear';
        }
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // SOCKETSEND: Wrapper to easily call a server method
    //
    self.socketSend = function()
    {
        var obj = {};
        obj[arguments[0]] = Array.prototype.slice.call(arguments).slice(1);
        self.socketio.send(obj);
    }    

    return self;
}(BOOTSTRAP || {}));