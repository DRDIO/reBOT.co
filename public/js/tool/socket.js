var BOOTSTRAP = (function($$)
{
    $$.socketio = {};
    $$.socket   = {
        approved: false,
        promise: $.Deferred()
    }

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // INIT: Create socket object, setup listener events, and connect for first time
    //
    $$.initSocket = function() 
    {
        // console.log('initializing');
        
        $$.socketio = io.connect();

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // CONNECT: As soon as we connect, send credentials. Chat is still disabled at this time.
        //
        $$.socketio.on('connect', function()
        {
            $$.socket.promise.resolve();
            console.log('connected');
        });
        
        $$.socketio.on('disconnect', function()
        {
            console.log('disconnected');
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

        return $$.socket.promise;
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