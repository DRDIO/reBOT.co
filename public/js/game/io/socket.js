define(['/socket.io/socket.io.js'], function()
{

    var Socket = $C.extend({
        socket:     null,
        approved:   null,
        promise:    null,

        init: function()
        {
            $L.html('Creating Socket');
            
            this.approved = false;
            this.promise  = $.Deferred();
        },
        
        connect: function() {
            this.socket = io.connect();
            
            var promise = this.promise;

            this.socket.on('connect', function() {
                promise.resolve();
                $L.html('Connected to Server');
            });

            this.socket.on('disconnect', function() {
                console.log('disconnected');
            });
            
            return this;
        },
        
        emit: function(method, data) 
        {
            this.socket.emit(method, data);
            return this;
        },
        
        on: function(method, func) 
        {
            this.socket.on(method, func);
            return this;
        },
        
        getPromise: function()
        {
            return this.promise;
        }
    });
    
    return Socket;
    
});