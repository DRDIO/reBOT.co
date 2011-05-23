var BOOTSTRAP = (function($$) {    
    $$.init = function()
    {
        $('#loading section').html('Connecting &amp; Loading Images');

        $$.initDom();

        // All images and sockets must be connected first
        var promises = $$.loadImages();
        promises.push($$.initSocket());

        // Then render and start game
        $.when.apply($, promises).done(function()
        {
            $$.initRenderer();
            $$.initGame();
            
            // When everything is setup, allow mouse and keyboard movements
            APP.attachEvents();

            $('#page').fadeIn(250);
            $('#loading').stop().fadeOut(250);
       });
    }

    $$.initGame = function()
    {
        // Set the seed, get a simplex noise object and clear the map        
        $$.map     = {};
        
        // Seed our center area (render will start in initRenderer or timeout)
        $$.seed($$.player.gx, $$.player.gy, $$.settings.rstep);
    }

    $$.seed = function(x, y, r)
    {
        for (var xstep = x - r; xstep <= x + r; xstep++) {
            if (!(xstep in $$.map)) {
                $$.map[xstep] = {};
            }

            for (var ystep = y - r; ystep <= y + r; ystep++) {
                if (!(ystep in $$.map[xstep])) {
                    $$.map[xstep][ystep] = {};
                    $$.setTileHeight(xstep, ystep);
                }
            }
        }
    }

    $$.setTileHeight = function(xstep, ystep)
    {
        var z, zrand, zlimit;

        var zrand1 = APP.simplex.noise(xstep / $$.settings.nstep1, ystep / $$.settings.nstep1) * $$.settings.namp1;
        var zrand2 = APP.simplex.noise(xstep / $$.settings.nstep2, ystep / $$.settings.nstep2) * $$.settings.namp2;

        // TODO: Smooth location around spawn for climbing
        zrand = zrand1 + zrand2;        
        zrand = $$.smoothTerrain(zrand, xstep, ystep, $$.settings.rstep);

        $$.map[xstep][ystep].z = Math.round(zrand);
    }

    $$.smoothTerrain = function(z, dx, dy, dr)
    {
        // Quickly check if tile is within square of radius dr
        if (Math.abs(dx) <= dr && Math.abs(dy) <= dr) {
            // Get the distance from tile (circular)
            var r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if (dr / 2 * Math.random() + 1 > r) {
                $$.map[dx][dy].t = 'road' + Math.ceil(Math.random() * 4);
            }
                
            if (r < dr) {
                
                return r * z / dr;
            }
        }

        return z;
    }

    $$.userApproved = function(user)
    {
        // console.log(user);
    }

    return $$;
}(BOOTSTRAP || {}));