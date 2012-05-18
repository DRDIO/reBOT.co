define(['./entity'], function() {
    APP.PLAYER_PATH = '/img/npc/002.png';
    
    APP.Player = function() 
    {
        
    };
    
    APP.Player.prototype = new APP.Entity();
    APP.Player.prototype.constructor = APP.Player;    
    
    APP.player = new APP.Player();
});