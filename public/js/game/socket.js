var BOOTSTRAP = (function($$)
{
    $$.socketio = {};
    $$.socket   = {
        approved: false,
        timeoutId: null,
        attempts: 0,
        promise: $.Deferred()
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // INIT: Create socket object, setup listener events, and connect for first time
    //
    $$.initSocket = function() 
    {
        // console.log('initializing');
        
        $$.socketio = new io.Socket(null, {rememberTransport: false});

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // CONNECT: As soon as we connect, send credentials. Chat is still disabled at this time.
        //
        $$.socketio.on('connect', function()
        {
            // console.log('connected');
            $$.socket.promise.resolve();
            
            $$.socketSend('init', $$.cookieRead('connect.sid'));

            // Clear reconnect timeout and set to 0 for attempts
            clearTimeout($$.socket.timeoutId);
            $$.socket.attempts = 0;
        });

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // DISCONNECT: Attempt to reconnect immediately
        //
        $$.socketio.on('disconnect', function()
        {
            $$.socket.approved = false;
            $$.socketConnect();
        });

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // MESSAGE: Process a response from the server based on onMessages methods
        //
        $$.socketio.on('message', function(response)
        {
            try {
                for (var first in response) break;

                if (typeof response[first] != 'object') {
                    throw 'Invalid JSON string to call a method';
                }

                if (!(first in $$) || typeof $$[first] != 'function') {
                    throw 'JSON function does not exist in world object';
                }

                $$[first](response[first]);
            } catch (err) {
                // console.log(err);
                // console.log('Unable to find proper method');
            }
        });

        $$.socketConnect();

        return $$.socket.promise;
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // SOCKETCONNECT: Setup and attempt to connect to the server
    //
    $$.socketConnect = function() {
        // console.log('connecting');
        
        if (typeof $$.socketio != 'undefined') {
            // Try connecting 3 times (reset to 0 on successful connect)
            if ($$.socket.attempts < 3) {
                if (!$$.socketio.connecting && !$$.socketio.connected) {
                    $$.socket.attempts++;
                    $$.socketio.connect();
                }

                // Check back after timeout for another attempt
                clearTimeout($$.socket.timeoutId);
                $$.socket.timeoutId = setTimeout($$.socketConnect,
                    $$.socketio.options.connectTimeout);
            } else {
                $$.socketRestart({
                    message: 'We were unable to connect you after ' + $$.socket.attempts + ' attempts (T1).'
                });
            }
        } else {
            $$.socketRestart({
                message: 'No socket connection exists (T2).'
            });
        }
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // SOCKETRESTART: As soon as we connect, send credentials. Chat is still disabled at this time.
    //
    $$.socketRestart = function(response)
    {
        // Add detailed messages on errors
        $$.cookieErase('connect.sid');

        var message = response.message || 'There was an unknown error (E0)';
        if (confirm(message + '\nWould you like to restart reBot.co?')) {
            location.href = '/clear';
        }
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // SOCKETSEND: Wrapper to easily call a server method
    //
    $$.socketSend = function()
    {
        var obj = {};
        obj[arguments[0]] = Array.prototype.slice.call(arguments).slice(1);
        $$.socketio.send(obj);
    }    

    return $$;
}(BOOTSTRAP || {}));