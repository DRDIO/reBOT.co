define([
    './io/socket',
    './world/world',
    './tool/hash'
], function (Socket, World, Hash) {

    // Inform user of current step
    $L.html('Loading Game Files');

    /**
     * @class Game
     */
    return $C.extend({
        config: null,

        /**
         * @param {World} world
         */
        world: null,
        socket: null,
        settings: null,

        /**
         *
         * @param config
         * @param {Input} input
         * @param {Output} output
         */
        init: function (config, input, output) {
            // Then render and start game
            var game = this;
            var hash = new Hash();
            var promises = [];

            this.settings = hash.parse(config.settings);

            // Connect with the socket
            this.socket = new Socket();

            promises.push(output.getPromises());
            promises.push(this.socket.connect().getPromise());

            // Create World with player
            this.world = new World(this.settings, this.socket, this.settings.seed);

            // Bind movements to update world
            input.attachMove(function(dir) {
                game.world.movePlayer(dir);
            });

            // Bind resetting to restart game
            input.attachReset(function() {
                // Force a new seed and reboot game
                game.settings.seed = Math.random();
                game.restart();
            });

            output.bindGame(this);

            $.when.apply($, promises).done(function () {
                // Start rendering game to screen
                output.start();

                setInterval(function () {
                    output.render(game.settings, game.world);
                }, 1000 / game.settings.fps);
            });
        },

        restart: function () {
            this.world.build(this.settings, this.settings.seed);
        }
    });
});
