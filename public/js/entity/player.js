define(function() {
    APP.PLAYER_PATH = '/img/npc/002.png';
});

var BOOTSTRAP = (function($$) {    
    $$.player = {
        // player states (jumping and falling mutually exclusive)
        walking:   false,
        jumping:   0,

        // Animation steps
        tileCount: 0,
        tileInt:   3,

        // last (or current x) before animation cycle
        gx:        0,
        gy:        0,

        qx: 0,
        qy: 0,

        // Player direction (NW = 0, NE = 1, SE = 2, SW = 3),
        dir: 3,

        // Relative changes to next tile
        // (nx and ny {-1,1}, nz has no limit)
        nx: 0,
        ny: 0,
        nz: 0,

        jumpMin: 2,
        jumpMax: 4,

        fallMin: -2,
        fallMax: -8,

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
                return;
            }

            $$.player.dir = dir;

            var playerTile = APP.world.getTile($$.player.gx, $$.player.gy);
            var nextTile   = APP.world.getTile($$.player.gx + $$.player.nx, $$.player.gy + $$.player.ny);

            var gz = playerTile.getZ();
            var zNext = nextTile.getZ();

            $$.player.gz = gz;
            $$.player.nz = zNext - gz;

            if ($$.player.nz > $$.player.jumpMax || $$.player.nz < $$.player.fallMax) {
                console.log('not safe');
                return;
            } else if ($$.player.nz > $$.player.jumpMin || $$.player.nz < $$.player.fallMin) {
                $$.player.jumping = 3;
            }

            if (!$$.player.walking && dir == $$.player.dir) {
                $$.player.tileCount = 0;
            }

            $$.player.walking = true;
        },

        getInfo: function() {
            var xtemp = $$.player.gx,
                ytemp = $$.player.gy,
                ztemp = APP.world.getTile($$.player.gx, $$.player.gy).getZ();
                
            // Subtle player movements between tiles
            // Includes walking and jumping animations / calculations
            if ($$.player.walking && $$.player.tileCount < $$.player.tileInt) {
                // calculate partial player position between tiles
                var apart = ($$.player.tileCount + 1) / $$.player.tileInt;
                    xtemp = $$.player.nx * apart + $$.player.gx;
                    ytemp = $$.player.ny * apart + $$.player.gy;
                    ztemp = $$.player.nz * apart + $$.player.gz;

                // This condition will stop when tileCount stays larger than tileInt
                // This is reset when key is pressed or held for walking
                $$.player.tileCount++;

                // Once we have completed an animation cycle, reset if key is down or stop if not walking
                // Update last player tile to next tile
                if ($$.player.tileCount == $$.player.tileInt) {
                    if (!APP.keyboard.isPressed()) {
                        $$.player.walking = false;                        
                    }

                    $$.player.tileCount = 0;
                    $$.player.jumping   = 0;

                    xtemp = $$.player.gx += $$.player.nx;
                    ytemp = $$.player.gy += $$.player.ny;
                    ztemp = $$.player.gz += $$.player.nz;

                    $$.player.nx = $$.player.nx;
                    $$.player.ny = $$.player.ny;
                }
            }
            
            return {
                // x and y Map related to actual map matrix coordinates
                // x and y Raw are floats putting a player on or between tiles on a map
                xMap: $$.player.gx,
                yMap: $$.player.gy,
                xRaw: xtemp,
                yRaw: ytemp,
                zRaw: ztemp
            }
        }
    };

    return $$;
}(BOOTSTRAP || {}));