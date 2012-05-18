var _         = require('underscore'),
    AppAction = require('./appaction');

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// App Event stores all automated methods between client and server
// Most of these will end up calling methods in AppAction
// @see AppAction

/**
 * @augments AppAction
 */
var AppEvent = {
    
    e_playermove: function(user, x, y, z) {
        // We do a variety of things and then we update everyone else
        console.log('playermove');
    }
};

module.exports = AppAction.extend(AppEvent);