var BOOTSTRAP = (function($$) {    
    $$.player = {
        // player states (jumping and falling mutually exclusive)
        walking:   false,
        jumping:   false,
        falling:   false,

        // Animation steps
        tileCount: 0,
        tileInt:   3,

        // last (or current x) before animation cycle
        gx:        0,
        gy:        0,

        // Player direction (NW = 0, NE = 1, SE = 2, SW = 3),
        dir: 3,

        // Relative changes to next tile
        // (nx and ny {-1,1}, nz has no limit)
        nx: 0,
        ny: 0,
        nz: 0,

        jumpMinStep: 2,
        jumpMaxStep: 4,

        fallMinStep: 2,
        fallMaxStep: 8,

        move: function(dir) {
            $$.player.nx = 0;
            $$.player.ny = 0;
            
            switch (dir) {
                case 0:
                    $$.player.nx = -1;
                    break;
                case 1:
                    $$.player.ny = -1;
                    break;
                case 2:
                    $$.player.nx = 1;
                    break;
                case 3:
                    $$.player.ny = 1;
                    break;
                default:
                    return;
            }

            // Let them turn around without moving
            if (!$$.player.walking && $$.player.dir != dir) {
                // console.log('turning');
                $$.player.dir = dir;
                // $$.player.nx = 0;
                // $$.player.ny = 0;
                return;
            }

            $$.player.dir = dir;
            
            var gz = $$.map[$$.player.gx][$$.player.gy].z;
            var nz = $$.map[$$.player.gx + $$.player.nx][$$.player.gy + $$.player.ny].z;

            $$.player.nz = nz - gz;

            if ($$.player.nz > $$.player.jumpstep) {
                $$.player.jumping = true;
            } else if ($$.player.nz < -$$.player.jumpstep) {
                $$.player.falling = true;
            }

            // If jetpack is off, only small z traversal (small blocks)
            if (!$$.settings.jetpack && Math.abs(gz - nz) > $$.settings.zjump) {
                // console.log('too high');
                $$.player.nx = 0;
                $$.player.ny = 0;
                return;
            }

            if (!$$.player.walking && dir == $$.player.dir) {
                $$.player.tileCount = 1;
            }

            // Make sure a tile exists at coords
            $$.seed($$.player.gx + $$.player.nx, $$.player.gy + $$.player.ny, $$.settings.rstep);

            $$.player.walking = true;
        },

        getInfo: function() {
            var xtemp = $$.player.gx,
                ytemp = $$.player.gy;
                
            // Subtle player movements between tiles
            // Includes walking and jumping animations / calculations
            if ($$.player.tileCount && $$.player.tileCount <= $$.player.tileInt) {
                // calculate partial player position between tiles
                var apart = $$.player.tileCount / $$.player.tileInt;
                    xtemp = $$.player.nx * apart + $$.player.gx;
                    ytemp = $$.player.ny * apart + $$.player.gy;

                // Once we have completed an animation cycle, reset if key is down or stop if not walking
                // Update last player tile to next tile
                if ($$.player.tileCount == $$.player.tileInt) {
                    if (!APP.keyboard.isPressed()) {
                        $$.player.walking = false;
                    } else if ($$.player.walking) {
                        $$.player.tileCount = 1;
                    }

                    xtemp = $$.player.gx += $$.player.nx;
                    ytemp = $$.player.gy += $$.player.ny;
                }

                // This condition will stop when tileCount stays larger than tileInt
                // This is reset when key is pressed or held for walking
                $$.player.tileCount++;
            }

            return {
                x: xtemp,
                y: ytemp
            }
        }
    };

    return $$;
}(BOOTSTRAP || {}));