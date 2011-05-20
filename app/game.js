// // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Chat Extension variables
//
var config = require('../config/game'),
    game   = function() {};

game.prototype.init = function()
{
    // I think the scope of this will be listener from ./socketconnect
    console.log('game init');
};

game.prototype.onMessage = function(response)
{
    // Scope should be the client from ./socketconnect
    console.log('game message');
    console.log(response);
};

game.prototype.onDisconnect = function()
{
    // Scope should be the client from ./socketconnect
    console.log('game disconnecting');
};

module.exports = new game();