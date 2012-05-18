var _        = require('underscore'),
    Sioa     = require('socketioauth'),
    UserList = require('./userlist');

var AppBoiler = {    
    timerList:     null,
    userList:      null,
    cleanupIntvl:  null,

    init: function(config) 
    {
        try {
            this._super(config);

            this.timerList = config.timerList;

            // Setup room and user lists
            this.userList = new UserList(this.db.collection('user'), config.dft.owner || null);

            this.setCleanup();

        } catch (err) {
            console.log('AppBoiler.init');
            console.log(err.stack || err.message || err);
        }
    },
    
    setCleanup: function() 
    {
        console.log('setting up cleanup');
        clearInterval(this.cleanupIntvl);
        this.cleanupIntvl = setInterval(_.bind(this.cleanup, this), this.timerList.cleanup);
    },

    // Override socket connection to setup socket info
    onConnect: function(socket) 
    {
        try {
            this._super(socket);

            // Additional app setup
            var session = this.getSession(socket);

            if (!session) {
                socket.emit('restart', 'Unable to retrieve session.');
            } else {
                var userSession = session.user || null;

                // Kick for corrupt session data
                if (!userSession || !userSession.uid) {
                    console.log('Unable to setup user session');
                    socket.emit('restart', 'Unable to retrieve your account.');
                    
                } else {
                    // Store their current SID to pass into onConnect
                    userSession.sid = socket.id;
                    
                    // Perform the necessary db checks to load up a user
                    this.userList.onConnect(userSession);
                }
            }
        } catch (err) {
            console.log('AppBoiler.onConnect');
            console.log(err.stack || err.message || err);
        }
    },
    
    onDisconnect: function() 
    {
        try {
            this._super();

            var user = this.app.userList.isUser(this.id, true);

            if (user) {
                console.log('disconnecting ' + user.uid);
                user.isConnected(false);
                
            } else {
                console.log('invalid session to client pair (polling)');
            }        
        } catch(err) {
            console.log('AppBoiler.onDisconnect');
            console.log(err.stack || err.message || err);
        }
    },
    
    onMessage: function(request)
    {
        try {
            this._super(request);

            var key    = _.first(_.keys(request)),
                method = 'e_' + key;

            if (_.isFunction(this.app[method])) {
                // In our onMessage override, we are always trying to get a UID
                var user = this.app.userList.isUser(this.id, true);

                if (user) {
                    request[key].unshift(user);                
                    this.app[method].apply(this.app, request[key]);
                } else {
                    console.log('unable to track user ' + this.id);
                }
            } else {
                console.log('invalid method call ' + key);
            }       
        } catch(err) {
            console.log('AppBoiler.onMessage');
            console.log(err.stack || err.message || err);
        }
    },
    
    messageUser: function(method, request, user) 
    {
        try {
            this.messageClient(this.getSocket(user.sid), method, request);
        } catch(err) {
            console.log('AppBoiler.messageUser ' + method);
            console.log(err.stack || err.message || err);
        }
    },
    
    cleanup: function()
    {
        try {
            var time = new Date().getTime();            
            
            console.log('TIMER: Cleanup: ' + time + ' to ' + (new Date).getTime());

        } catch(err) {
            console.log('AppBoiler.cleanup');
            console.log(err.stack || err.message || err);
        }
    }
};

module.exports = Sioa.extend(AppBoiler);