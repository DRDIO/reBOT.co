// // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Chat Extension variables
//
var config = require('../config/game'),
    game   = function() {};

game.prototype.init = function()
{
    console.log('init: this = listener');
}

game.prototype.connect = function()
{
    console.log('connect: this = client');
};

game.prototype.playerMove = function(x, y) {
    // We do a variety of things and then we update everyone else

    this.listener.broadcast('echo');
    this.send('shh');
}

game.prototype.disconnect = function()
{
    console.log('disconnect: this = client');
}

module.exports = new game();