define([
    './keyboard'
], function(Keyboard) {

    /**
     * @class Input
     */
    return $C.extend({
        keyboard:       null,

        init: function()
        {
            // Gather keyboard (bind to DOM)
            this.keyboard = new Keyboard();

            return this;
        },

        bindGame: function(game)
        {
            var input = this;

            $(window).keydown(function(e) {
                var action = input.keyboard.press(e.which);

                if (action == 'move') {
                    var dir = input.keyboard.mapDirection();
                    game.world.movePlayer(dir);
                }
            });

            $(window).keyup(function(e) {
                input.keyboard.release(e.which);
            });

            $('#panel').hover(function() {
                $(this).fadeTo(250, 1);
            }, function() {
                $(this).fadeTo(250, 0.25);
            });

            $('#setting-refresh').click(function() {
                // Force a new seed and reboot game
                game.settings.seed = Math.random();
                game.restart();
            });

            return this;
        }
    });
});
