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
            var hash = new Hash();
            this.settings = hash.parse(config.settings);

            // Connect with the socket
            this.socket = new Socket();

            var promises = [];
            promises.push(output.getPromises());
            promises.push(this.socket.connect().getPromise());

            // Create World with player
            this.world = new World(this.settings, this.socket, this.settings.seed);

            input.bindGame(this);
            output.bindGame(this);

            // Then render and start game
            var game = this;

            $.when.apply($, promises).done(function () {
                // Start rendering game to screen
                output.start();

                setInterval(function () {
                    console.log(game.world.player.queuedDir);
                    output.render(game.settings, game.world);
                }, 1000 / game.settings.fps);
            });
        },

        restart: function () {
            this.world.build(this.settings, this.settings.seed);
            //this.world.generateSimplex(this.settings.seed)
            //this.renderFrame();
        }
    });
});
