define([
    './display/display', 
    './io/socket',
    './world/world',     
    './io/keyboard',    
    './dom',
], function(Display, Socket, World, Keyboard, Dom) {

    // Inform user of current step
    $L.html('Loading Game Files');
    
    var Game = $C.extend({
        config:         null,
        spriteAlbum:    null,
        world:          null,
        display:        null,
        keyboard:       null,
        socket:         null,
        dom:            null,
        settings:       null,
        
        init: function(config) 
        {
            this.config = config;

            // Connect with the socket
            this.socket = new Socket();
            
            // Setup DOM and attempt to load settings from URL
            this.dom      = new Dom(config);
            
            this.settings = this.dom.loadHash(config.initSettings);            

            // Create a 2d display attached to the #game DOM and name it canvas
            this.display = new Display($(config.domCanvas), 'canvas', config.spritePaths);
            
            // Image loading might take a while, get all of the sprite promises
            var promises = this.display.getPromises();
            
            // Get the socket promises as well            
            promises.push(this.socket.connect().getPromise());
            
            this.world = new World(this.settings, this.socket);            
            
            this.keyboard = new Keyboard();
                                    
            // Then render and start game
            var game = this;
            $.when.apply($, promises).done(function() {
                // Start rendering game to screen
                game.renderFrame();
                
                // When everything is setup, allow mouse and keyboard movements
                game.dom
                    .attachToolbar(game)
                    .attachEvents(game)
                    .start();
                    
                
            });  
        },
        
        renderFrame: function()
        {
            // Fascilitate communication between layers and provide necessary info
            this.display.render(this.world, this.world.player, this.settings.rstep);
            
            var game = this;
            setTimeout(function() {
                game.renderFrame();
            }, 1000 / game.settings.fps);
        }
    });
        
    return Game;
});
