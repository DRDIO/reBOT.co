define([
    './display',
    './dom'
], function(Display, Dom) {

    /**
     * @class Output
     */
    return $C.extend({
        display:        null,
        dom:            null,
        promises:       null,
        game:           null,
        config:         null,

        init: function(config)
        {
            this.config = config;

            // Setup Canvas Display with Sprites
            this.display = new Display($(config.domCanvas), 'canvas', config.spritePaths);

            // Setup DOM and attempt to load settings from URL
            this.dom = new Dom();

            // Image loading might take a while, get all of the sprite promises
            this.promises = this.display.getPromises();

            return this;
        },

        bindGame: function(game) {
            this.game = game;

            // When everything is setup, allow mouse and keyboard movements
            this.dom
                .attachToolbar(game, this.config.mixer);
        },

        start: function()
        {
            this.dom.start();

            return this;
        },

        getPromises: function()
        {
            return this.promises;
        },

        render: function(settings, world)
        {
            // Fascilitate communication between layers and provide necessary info
            this.display.render(world, world.player, settings.rstep);
        }
    });
});
