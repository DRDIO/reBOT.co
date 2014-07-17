define([
    './display',
    './dom',
    '../../lib/threejs'
], function(Display, Dom) {

    /**
     * @class Output
     */
    return $C.extend({
        dom:            null,
        promises:       null,
        game:           null,
        config:         null,
        scene:          null,
        camera:         null,
        renderer:       null,
        cube:           null,

        // Information passed from game and stored for renders
        settings: null,
        world: null,

        init: function(config)
        {
            this.config = config;

            // Setup Canvas Display with Sprites
            this.display = new Display(config.spritePaths);

            // Setup DOM and attempt to load settings from URL
            this.dom = new Dom();

            return this;
        },

        bindGame: function(game) {
            this.game = game;

            // When everything is setup, allow mouse and keyboard movements
            this.dom.attachToolbar(game, this.config.mixer);
        },

        start: function(settings, world)
        {
            this.settings = settings;
            this.world    = world;

            this.dom.start();
            this.render();
            this.render();

            return this;
        },

        getPromises: function()
        {
            return this.promises;
        },

        render: function()
        {
            requestAnimationFrame(this.render.bind(this));

            // Fascilitate communication between layers and provide necessary info
            this.display.render(this.world, this.world.player, this.settings.rstep);
        }
    });
});
