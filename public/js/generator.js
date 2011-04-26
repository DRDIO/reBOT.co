$(function() 
{
    // Build out core objects
    var imgDir  = 'img/',
        tiles = {
            'dirt': {
                'url':  'terrain/001x50.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'water': {
                'url':  'terrain/002.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'ice': {
                'url':  'terrain/003.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'stone': {
                'url':  'terrain/004.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'sand': {
                'url':  'terrain/005.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'plain': {
                'url':  'terrain/007.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'hill': {
                'url':  'terrain/006.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'player': {
                'url':  'npc/001.png',
                'xoff': 21,
                'yoff': 31,
                'w'   : 42,
                'h'   : 42
            }
        },
        map = {};

    // Create terrain object (TODO: Loop)
    var promises = [];
    for (var i in tiles) {
        (function(tile, promise) {
            tile.img        = new Image();
            tile.img.src    = imgDir + tile.url;
            tile.img.onload = function() {
                tile.cvs        = document.createElement('canvas');
                tile.cvs.width  = tile.img.width;
                tile.cvs.height = tile.img.height;
                tile.ctx        = tile.cvs.getContext('2d');

                tile.ctx.drawImage(tile.img, 0, 0);
                delete tile.img;

                promise.resolve();
            }
        })(tiles[i], promises[promises.push($.Deferred()) - 1]);
    }

    // When all images load, run INIT()
    $.when.apply($, promises).done(init);

    // Implement Game Canvas
    $('#game').canvas();

    var build     = document.createElement ('canvas'),
        buildCtx  = build.getContext('2d');

    // Setup common dimensions
    var w         = $('#game').canvasWidth(),
        h         = $('#game').canvasHeight(),
        xc        = w / 2,
        yc        = h / 2,
        zstep  = 8,
        zlimit = zstep * 5000,              // Height Limit of world (+-)
        zwater = zstep * -11,                // Sea Level
        zsand  = zstep * -8,
        zplain = zstep * -4,
        zhill  = zstep * 6,
        zstone = zstep * 10,
        zice   = zstep * 13,                // Mountain Tops
        zjump  = zstep * 2,                 // How high can player jump
        
        nstep  = 32,                        // Noise Frequency
        namp   = 24,                        // Noise Amplitude

        fps    = 10,

        steps  = 20,                        // Number of steps to generate out from player (init)
        rstep  = 20,                        // Number of tiles to render
        gx     = 0,
        gy     = 0;
        pdir   = 3;                            // Player direction (NW = 0, NE = 1, SE = 2, SW = 3)

    // Directional keys
    var KEY_NW = 37,
        KEY_NE = 38,
        KEY_SE = 39,
        KEY_SW = 40;

    // Init Remaining Globals
    var simplex, settingLock, settingRandom, settingJetpack, settingDisco;

    build.width  = w;
    build.height = h;

    // Manage change event for setting toggles
    $('#setting-lock input, #setting-random input').change(init);
    $('#setting-jetpack input, #setting-disco input').change(function() {
        settingJetpack = $('#setting-jetpack input:checked').val();
        settingDisco   = $('#setting-disco input:checked').val();
    });

    $('#setting-refresh').button().click(init);

    $(window).keydown(function(e) {
        key = e.which;

        var gxtemp = gx, gytemp = gy, pdirtemp = pdir;

        if (key == KEY_NW) {
            gx  -= 1;
            pdir = 0;
        } else if (key == KEY_NE) {
            gy  -= 1;
            pdir = 1;
        } else if (key == KEY_SE) {
            gx  += 1;
            pdir = 2;
        } else if (key == KEY_SW) {
            gy  += 1;
            pdir = 3;
        }

        // Let them turn around without moving
        if (pdir != pdirtemp) {
            gx = gxtemp;
            gy = gytemp;
        }

        // Make sure a tile exists at coords
        seed(gx, gy, steps);

        // If jetpack is off, only zstep traversal (small blocks)
        if (settingJetpack == 'off' && Math.abs(map[gx][gy].z - map[gxtemp][gytemp].z) > zjump) {
            gx = gxtemp;
            gy = gytemp;
        }
    });

    function tintCanvas(ctx, w, h, r, g, b)
    {
        var imgData = ctx.getImageData(0, 0, w, h);
        for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i]     += r;
            imgData.data[i + 1] += g;
            imgData.data[i + 2] += b;
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function init()
    {
        // Create Custom Player
        tintCanvas(tiles.player.ctx,
            tiles.player.cvs.width,
            tiles.player.cvs.height,
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128));

        // Setup Simplex Noise Map Generation

        simplex        = new SimplexNoise();
        settingLock    = $('#setting-lock input:checked').val();
        settingRandom  = $('#setting-random input:checked').val();
        settingJetpack = $('#setting-jetpack input:checked').val();

        gx  = 0;
        gy  = 0;
        map = {};

        seed(gx, gy, steps);
        render();
    }

    function seed(x, y, r)
    {
        for (var xstep = x - r; xstep <= x + r; xstep++) {
            if (!(xstep in map)) {
                map[xstep] = {};
            }

            for (var ystep = y - r; ystep <= y + r; ystep++) {
                if (!(ystep in map[xstep])) {
                    map[xstep][ystep] = {};
                    setTileHeight(xstep, ystep);
                }
            }
        }
    }

    function setTileHeight(xstep, ystep)
    {
        var z,
            zrange = searchNeighbors(xstep, ystep);

        if (!zrange) {
            z = zstep;
        } else {
            var zrand, zlimit;

            if (settingRandom == 'simplex') {
                zrand = simplex.noise(xstep / nstep, ystep / nstep);

                // TODO: Smooth location around spawn for climbing
                zrand = smoothTerrain(zrand, xstep, ystep, rstep);


            } else {
                zrand = Math.random();
            }

            if (settingLock == 'lock') {
                var zoff = (zrange.zmax - zrange.zmin);
                zlimit = zrand * zoff + zrange.zmin;
            } else if (settingLock == 'free') {
                zlimit = zrand * zstep * namp;
            } else {
                zlimit = zstep;
            }

            z = Math.round(zlimit / zstep) * zstep;
        }

        map[xstep][ystep].z = z;
    }

    function smoothTerrain(z, dx, dy, dr)
    {
        // Quickly check if tile is within square of radius dr
        if (Math.abs(dx) <= dr && Math.abs(dy) <= dr) {
            // Get the distance from tile (circular)
            var r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if (r < dr) {
                // Use weights to smooth terrain to zstep values
                return (r * z) / dr;
            }
        }

        return z;
    }

    function render()
    {
        // Clear Canvases
        $('#game').clearRect(0, 0, w, h);
        buildCtx.clearRect(0, 0, w, h);

        for (var xstep = gx - rstep; xstep <= gx + rstep; xstep++) {
            for (var ystep = gy - rstep; ystep <= gy + rstep; ystep++) {
                if (xstep in map && ystep in map[xstep]) {
                    var tile    = tiles.dirt;
                    var zsource = map[xstep][ystep].z;

                    var xtile = xstep - gx, ytile = ystep - gy;
                    var ztile = zsource - map[gx][gy].z;

                    if (settingDisco == 'on') {
                        zsource *= Math.random();
                    }

                    if (zsource < zwater) {
                        tile    = tiles.water;
                        zsource = zwater;
                    } else if (zsource < zsand) {
                        tile    = tiles.sand;
                    } else if (zsource < zplain) {
                        tile    = tiles.plain;
                    } else if (zsource > zice) {
                        tile    = tiles.ice;
                    } else if (zsource > zstone) {
                        tile    = tiles.stone;
                    } else if (zsource > zhill) {
                        tile    = tiles.hill;
                    }

                    renderTile(tile, xtile, ytile, ztile);
                }
            }
        }

        // Overlay a translucent player to deal with obfuscation
        renderPlayer(true);

        // Time of Day
        var time = new Date().getTime();
            time = Math.abs(time % 30000 - 15000) / 30000;
        //buildCtx.fillStyle = 'rgba(10, 50, 80, ' + time + ')';
        //buildCtx.fillRect(0, 0, w, h);

        // Put the build canvas onto the display canvas
        $('#game').canvasContext().drawImage(build, 0, 0, w, h, 0, 0, w, h);

        setTimeout(render, 1000 / fps);
    }

    function renderTile(tile, xstep, ystep, z)
    {
        // Translate 3D coordinates to 2D Isometric
        var xpos = xc + xstep * tile.xoff - ystep * tile.xoff - tile.xoff;
        var ypos = yc + xstep * tile.yoff + ystep * tile.yoff - z - tile.yoff;

        buildCtx.drawImage(tile.cvs, xpos, ypos);

        if (xstep == 0 && ystep == 0) {
            // Draw the player at moment of layer pass
            renderPlayer();
        }
    }

    function renderPlayer(isGhost)
    {
        if (isGhost) {
            buildCtx.globalAlpha = 0.5;
        }

        var sx = tiles.player.w * pdir,
            sy = 0,
            sw = tiles.player.w,
            sh = tiles.player.h,
            dx = xc - tiles.player.xoff,
            dy = yc - tiles.player.yoff;

        buildCtx.drawImage(tiles.player.cvs, sx, sy, sw, sh, dx, dy, sw, sh);
        buildCtx.globalAlpha = 1;
    }

    function searchNeighbors(xstep, ystep)
    {
        var zmax = -zlimit, zmin = zlimit;

        for (var xtemp = -1; xtemp <= 1; xtemp++) {
            for (var ytemp = -1; ytemp <= 1; ytemp++) {
                var x = xstep + xtemp, y = ystep + ytemp;
                if ((xtemp != 0 || ytemp != 0) && x in map && y in map[x]) {
                    zmax = Math.max(zmax, map[x][y].z);
                    zmin = Math.min(zmin, map[x][y].z);
                }
            }
        }

        return (zmax != -zlimit ? {
            'zmax': zmax - zstep,
            'zmin': zmin + zstep
            } : null);
    }
});