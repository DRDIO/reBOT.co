var config = require('../config/game');

/**
 * World Object Constructor
 * All methods prototyped after this will have access to the client object
 * The two most useful methods are send() and broadcast()
 * Also, the ability to grab client.sessionId is rather useful
 */
var game = function() {
    // TODO: Some initialization
};

var users = {};

/**
 * Client connect
 */
game.prototype.connect = function()
{
    console.log('connect: this = client');
};

game.prototype.init = function(sid)
{
    // We now wait for user to send session ID, then hack into connection
    if (!sid) {
        throw 'Cannot detect session ID (E1).';
    }

    // Session ID can have spaces, so convert back
    sid = unescape(sid);

    if (!('request' in this)) {
        throw 'We cannot detect your request (E4).';
    }

    var sessionStore = this.listener.getStore();

    if (!sessionStore) {
        throw 'We cannot detect your session store (E5).';
    }

    var session = sessionStore.sessions[sid] || null;
        session = JSON.parse(session);

    if (!session || !session.user) {
        throw 'We cannot detect your session (E2).';
    }

    // Attach the user name to the client
    // TODO: Otherway around, attach clientID to user table to avoid editing client object
    this.userName = session.user.name;
    var user      = session.user;
    var time      = new Date().getTime();

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // GLOBAL MANAGEMENT FOR USER
    //
    if (user.name in users) {
        // If user is already in list, pull from list
        user = users[user.name];
    } else {
        // Otherwise initialize additional vars
        user.op           = (user.name == 'kevinnuut');
        user.lastMessage  = '';
        user.tsMessage    = time;
        user.tsDisconnect = time;
        user.idle         = false;
    }

    console.log('init ' + user.name);

    // Setup core paramters as connected
    user.sessionId = this.sessionId;
    user.connected = true;
    user.tsConnect = time;

    // (re)Attach user to the chat users list
    users[user.name] = user;

    this.send({userApproved: user});
};

game.prototype.playerMove = function(x, y, z) {
    // We do a variety of things and then we update everyone else
    console.log('playermove');
    this.send('just yourself: ' + x);
    this.broadcast('everyone but you: ' + y);
    this.listener.broadcast('everyone: ' + z)
};

game.prototype.disconnect = function()
{
    console.log('disconnect: this = client');
};

module.exports = new game();