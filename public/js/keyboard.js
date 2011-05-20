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
                pdirtemp = $$.player.dir;

            if (key == $$.KEY_NW) {
                $$.player.nx  -= 1;
                $$.player.dir = 0;
            } else if (key == $$.KEY_NE) {
                $$.player.ny  -= 1;
                $$.player.dir = 1;
            } else if (key == $$.KEY_SE) {
                $$.player.nx  += 1;
                $$.player.dir = 2;
            } else if (key == $$.KEY_SW) {
                $$.player.ny  += 1;
                $$.player.dir = 3;
            }

            // Let them turn around without moving
            if (!$$.player.walking && $$.player.dir != pdirtemp) {
                $$.player.nx = $$.player.gx;
                $$.player.ny = $$.player.gy;
                return;
            }

            var gz = $$.map[$$.player.gx][$$.player.gy].z;
            var nz = $$.map[$$.player.nx][$$.player.ny].z;

            // If jetpack is off, only small z traversal (small blocks)
            if (!$$.settings.jetpack && Math.abs(gz - nz) > $$.settings.zjump) {
                $$.player.nx = $$.player.gx;
                $$.player.ny = $$.player.gy;
                return;
            }

            $$.player.walking   = true;
            $$.player.tileCount = 0;
            
            // Make sure a tile exists at coords
            $$.seed($$.player.nx, $$.player.ny, $$.settings.rstep);
        });

        $(window).keyup(function(e) {
            $$.player.walking = false;
        });
    };

    return $$;
}(BOOTSTRAP || {}));