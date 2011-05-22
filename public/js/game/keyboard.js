var BOOTSTRAP = (function($$)
{
    $$.KEY_NW = 37,        // Directional keys
    $$.KEY_NE = 38,
    $$.KEY_SE = 39,
    $$.KEY_SW = 40;

    $$.initKeyboard = function()
    {
        $(window).keydown(function(e) {
            var key      = e.which,
                dir      = null;

            switch (key) {
                case $$.KEY_NW:
                    dir = 0;
                    break;
                case $$.KEY_NE:
                    dir = 1;
                    break;
                case $$.KEY_SE:
                    dir = 2;
                    break;
                case $$.KEY_SW:
                    dir = 3;
                    break;
            }

            if (dir != null) {
                $$.player.move(dir);
            }
            
            $$.player.keydown = true;
        });

        $(window).keyup(function(e) {
            $$.player.keydown = false;
        });
    };

    return $$;
}(BOOTSTRAP || {}));