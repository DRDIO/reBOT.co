var BOOTSTRAP = (function($$) 
{
    $$.initRenderer = function()
    {
        // Implement Game Canvas
        $('#game').canvas();

        $$.w        = $('#game').canvasWidth(),  // Setup common dimensions
        $$.h        = $('#game').canvasHeight(),
        $$.xc       = $$.w / 2,
        $$.yc       = $$.h / 2,
        $$.build    = document.createElement('canvas'),
        $$.buildCtx = $$.build.getContext('2d');

        $$.build.width  = $$.w;
        $$.build.height = $$.h;

        // Create Custom Player
        $$.tiles.player.ctx.clearRect(0, 0, $$.tiles.player.cvs.width, $$.tiles.player.cvs.height);
        $$.tiles.player.ctx.drawImage($$.tiles.player.img, 0, 0);
        $$.tintCanvas($$.tiles.player.ctx,
            $$.tiles.player.cvs.width,
            $$.tiles.player.cvs.height,
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128));

        $$.render();
    }

    $$.tintCanvas = function(ctx, w, h, r, g, b)
    {
        var imgData = ctx.getImageData(0, 0, w, h);
        for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i]     += r;
            imgData.data[i + 1] += g;
            imgData.data[i + 2] += b;
        }

        ctx.putImageData(imgData, 0, 0);
    }

    $$.render = function()
    {
        $('#game').clearRect(0, 0, $$.build.width, $$.build.height);
        $$.buildCtx.clearRect(0, 0, $$.build.width, $$.build.height);

        // Get the times stamp and set the temporary position to the last player tile
        var time  = new Date().getTime();

        // Returns (exact) x, y, z, (map tile) xtile, ytile, and (animation) key
        var playerPos = $$.player.getInfo();
        
        xtemp = playerPos.x;
        ytemp = playerPos.y;
        
        for (var xstep = $$.player.gx - $$.settings.rstep; xstep <= $$.player.gx + $$.settings.rstep; xstep++) {
            for (var ystep = $$.player.gy - $$.settings.rstep; ystep <= $$.player.gy + $$.settings.rstep; ystep++) {
                if (xstep in $$.map && ystep in $$.map[xstep]) {
                    var tile    = $$.tiles.dirt;
                    var zsource = $$.map[xstep][ystep].z;
                    var zrel    = $$.map[$$.player.gx][$$.player.gy].z;
                    var ztype   = zsource;
                    var zmax    = ($$.settings.namp1 + $$.settings.namp2) / 100;

                    if ($$.settings.random) {
                        ztype *= Math.random();
                    }

                    // type settings are percentages of max z range of map
                    if ($$.map[xstep][ystep].t) {
                        tile = $$.tiles[$$.map[xstep][ystep].t];
                    } else if (ztype < $$.settings.lvlwater * zmax) {
                        tile    = $$.tiles.mud;
                    } else if (ztype < $$.settings.lvlbeach * zmax) {
                        tile    = $$.tiles.sand;
                    } else if (ztype < $$.settings.lvlplain * zmax) {
                        tile    = $$.tiles.plain;
                    } else if (ztype > $$.settings.lvlsnow * zmax) {
                        tile    = $$.tiles.ice;
                    } else if (ztype > $$.settings.lvlmount * zmax) {
                        tile    = $$.tiles.stone;
                    } else if (ztype > $$.settings.lvlhill * zmax) {
                        tile    = $$.tiles.hill;
                    }

                    // x and ytile are the coordinates relative to center of screen
                    var xtile = xstep - xtemp,
                        ytile = ystep - ytemp,
                        ztile = zsource - zrel;

                    $$.renderTile(tile, xtile, ytile, ztile);

                    if (!$$.settings.drought && ztype < $$.settings.lvlwater * zmax) {
                        ztile = $$.settings.lvlwater * zmax - zrel;
                        tile  = $$.tiles['water' + (Math.round(time % 500 / 500) + 1)];
                        $$.renderTile(tile, xtile, ytile, ztile);
                    }
                }
            }
        }

        // Overlay a translucent player to deal with obfuscation
        $$.renderPlayer(true);

        // Time of Day
        // $$.timeOfDay();

        // Put the build canvas onto the display canvas
        $('#game').canvasContext().drawImage($$.build, 0, 0, $$.w, $$.h, 0, 0, $$.w, $$.h);

        setTimeout($$.render, 1000 / $$.settings.fps);
    }

    $$.renderTile = function(tile, xstep, ystep, z)
    {
        // Translate 3D coordinates to 2D Isometric
        var xpos = $$.xc + xstep * tile.xoff - ystep * tile.xoff - tile.xoff;
        var ypos = $$.yc + xstep * tile.yoff + ystep * tile.yoff - tile.yoff - z * $$.settings.zstep;

        $$.buildCtx.drawImage(tile.cvs, xpos, ypos);

        if (Math.floor(xstep) == 0 && Math.floor(ystep) == 0) {
            // Draw the player at moment of layer pass
            $$.renderPlayer();
        }
    }

    $$.renderPlayer = function(isGhost)
    {
        if (isGhost) {
            $$.buildCtx.globalAlpha = 0.5;
        }

        var sx = $$.tiles.player.w * $$.player.dir,
            sy = 0,
            sw = $$.tiles.player.w,
            sh = $$.tiles.player.h,
            dx = $$.xc - $$.tiles.player.xoff,
            dy = $$.yc - $$.tiles.player.yoff;

        $$.buildCtx.drawImage($$.tiles.player.cvs, sx, sy, sw, sh, dx, dy, sw, sh);
        $$.buildCtx.globalAlpha = 1;
    }

    $$.timeOfDay = function()
    {
        time = Math.abs(time % 30000 - 15000) / 60000;
        $$.buildCtx.fillStyle = 'rgba(10, 50, 80, ' + time + ')';
        $$.buildCtx.fillRect(0, 0, $$.w, $$.h);
    }

    return $$;
}(BOOTSTRAP || {}));