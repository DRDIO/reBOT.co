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

        attachMove: function(fn)
        {
            var input = this;

            $(window).keydown(function(e) {
                var action = input.keyboard.press(e.which);

                if (action == 'move') {
                    var dir = input.keyboard.mapDirection();
                    fn(dir);
                }
            });

            $(window).keyup(function(e) {
                input.keyboard.release(e.which);
            });

            return this;
        },

        attachReset: function(fn)
        {
            $('#setting-refresh').click(function() {
                fn();
            });
        }
    });
});
