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
            this.dom      = new Dom();
            
            // Generates settings from hash + mixer configs
            this.settings = this.dom.loadHash(config.settingsMixer);            
            this.settings.seed = config.randomSeed;

            // Create a 2d display attached to the #game DOM and name it canvas
            this.display = new Display($(config.domCanvas), 'canvas', config.spritePaths);
            
            // Image loading might take a while, get all of the sprite promises
            var promises = this.display.getPromises();
            
            // Get the socket promises as well            
            promises.push(this.socket.connect().getPromise());
            
            // Create World with player
            this.world = new World(this.settings, this.socket, this.settings.seed);            
            
            // Gather keyboard (bind to DOM)
            this.keyboard = new Keyboard();
                                    
            // Then render and start game
            var game = this;
            $.when.apply($, promises).done(function() {
                // Start rendering game to screen
                game.renderFrame();
                
                // When everything is setup, allow mouse and keyboard movements
                game.dom
                    .attachToolbar(game, config.settingsMixer)
                    .attachEvents(game)
                    .start();
                
            });  
        },

        restart: function()
        {
            this.world.build(this.settings, this.settings.seed);
            //this.world.generateSimplex(this.settings.seed)
            //this.renderFrame();
        },
        
        renderFrame: function()
        {
            // Fascilitate communication between layers and provide necessary info
            this.display.render(this.world, this.world.player, this.settings.rstep);
            
            var game = this;
            setTimeout(function() {
                game.renderFrame();
            }, 1000 / this.settings.fps);
        }
    });
        
    return Game;
});
