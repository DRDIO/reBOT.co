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
            'mud': {
                'url':  'terrain/002.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'water1': {
                'url':  'terrain/008.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'water2': {
                'url':  'terrain/009.png',
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
                // delete tile.img;

                promise.resolve();
            }
        })(tiles[i], promises[promises.push($.Deferred()) - 1]);
    }

    // When all images load, run INIT()
    $.when.apply($, promises).done(init);

    // Implement Game Canvas
    $('#game').canvas();

    var build       = document.createElement('canvas'),
        buildCtx    = build.getContext('2d'),
        
        settings    = {},
        simplex     = null,
        
        w           = $('#game').canvasWidth(),  // Setup common dimensions
        h           = $('#game').canvasHeight(),
        xc          = w / 2,
        yc          = h / 2,
        gx          = 0,         // Global Coordinates of Player
        gy          = 0,

        pdir        = 3,         // Player direction (NW = 0, NE = 1, SE = 2, SW = 3)
        KEY_NW      = 37,        // Directional keys
        KEY_NE      = 38,
        KEY_SE      = 39,
        KEY_SW      = 40;

    build.width  = w;
    build.height = h;

    // Manage change event for setting toggles
    $('#panel input').change(function() {
        var key = $(this).parent().attr('id').substr(8);
        settings[key] = $(this).parent().find('input:checked').val();
    }).change();

    $('#panel .slider').bind('slide', function(e, ui) {
        var key = $(this).attr('id').substr(8);
        settings[key] = parseInt($(this).slider('option', 'value'));
        if ($(this).attr('data-refresh')) {
            init();
        }
    });

    $('#panel .slider').bind('slidechange', function(e, ui) {
        var key = $(this).attr('id').substr(8);
        settings[key] = parseInt($(this).slider('option', 'value'));
    });

    $('#setting-refresh').click(init);

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
        seed(gx, gy, settings.rstep);

        // If jetpack is off, only zstep traversal (small blocks)
        if (settings.jetpack == 'off' && Math.abs(map[gx][gy].z - map[gxtemp][gytemp].z) > (settings.zstep * settings.zjump)) {
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
        tiles.player.ctx.clearRect(0, 0, tiles.player.cvs.width, tiles.player.cvs.height);
        tiles.player.ctx.drawImage(tiles.player.img, 0, 0);
        tintCanvas(tiles.player.ctx,
            tiles.player.cvs.width,
            tiles.player.cvs.height,
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128));

        // Setup Simplex Noise Map Generation

        simplex = new SimplexNoise();

        gx  = 0;
        gy  = 0;
        map = {};

        seed(gx, gy, settings.rstep);
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
        var z, zrand, zlimit;

        zrand = simplex.noise(xstep / settings.nstep, ystep / settings.nstep);

        // TODO: Smooth location around spawn for climbing
        zrand  = smoothTerrain(zrand, xstep, ystep, settings.rstep);
        zlimit = zrand * settings.zstep * settings.namp;

        z = Math.round(zlimit / settings.zstep) * settings.zstep;

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
        var time = new Date().getTime();

        for (var xstep = gx - settings.rstep; xstep <= gx + settings.rstep; xstep++) {
            for (var ystep = gy - settings.rstep; ystep <= gy + settings.rstep; ystep++) {
                if (xstep in map && ystep in map[xstep]) {
                    var tile    = tiles.dirt;
                    var zsource = map[xstep][ystep].z;
                    var ztype   = zsource;

                    if (settings.disco == 'on') {
                        ztype *= Math.random();
                    }

                    if (ztype < settings.lvlwater * settings.zstep) {
                        tile    = tiles.mud;
                    } else if (ztype < settings.lvlbeach * settings.zstep) {
                        tile    = tiles.sand;
                    } else if (ztype < settings.lvlplain * settings.zstep) {
                        tile    = tiles.plain;
                    } else if (ztype > settings.lvlsnow * settings.zstep) {
                        tile    = tiles.ice;
                    } else if (ztype > settings.lvlmount * settings.zstep) {
                        tile    = tiles.stone;
                    } else if (ztype > settings.lvlhill * settings.zstep) {
                        tile    = tiles.hill;
                    }

                    var xtile = xstep - gx, ytile = ystep - gy;
                    var ztile = zsource - map[gx][gy].z;

                    renderTile(tile, xtile, ytile, ztile);

                    if (settings.drought == 'off' && ztype < settings.lvlwater * settings.zstep) {
                        ztile = settings.lvlwater * settings.zstep - map[gx][gy].z;
                        tile  = eval('tiles.water' + (Math.round(time % 500 / 500) + 1));
                        renderTile(tile, xtile, ytile, ztile);
                    }
                }
            }
        }

        // Overlay a translucent player to deal with obfuscation
        renderPlayer(true);

        // Time of Day
        
            time = Math.abs(time % 30000 - 15000) / 30000;
        //buildCtx.fillStyle = 'rgba(10, 50, 80, ' + time + ')';
        //buildCtx.fillRect(0, 0, w, h);

        // Put the build canvas onto the display canvas
        $('#game').canvasContext().drawImage(build, 0, 0, w, h, 0, 0, w, h);

        setTimeout(render, 1000 / settings.fps);
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
});