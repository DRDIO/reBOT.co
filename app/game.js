// // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Chat Extension variables
//
var config = require('../config/game');

var game = module.exports = function() {}

game.prototype.init = function()
{
    // I think the scope of this will be listener from ./socketconnect
}

game.prototype.onMessage = function(response)
{
    // Scope should be the client from ./socketconnect
    console.log('game message');
    console.log(response);
}

game.prototype.onDisconnect = function()
{
    // Scope should be the client from ./socketconnect
    console.log('game disconnecting');
}