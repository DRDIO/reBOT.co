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
        var playerSprite = APP.spriteAlbum.get(APP.PLAYER_PATH);

        playerSprite.context.clearRect(0, 0, playerSprite.canvas.width, playerSprite.canvas.height);
        playerSprite.context.drawImage(playerSprite.image, 0, 0);
        $$.tintCanvas(playerSprite.context, playerSprite.canvas.width, playerSprite.canvas.height,
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
        // $('#game').clearRect(0, 0, $$.build.width, $$.build.height);
        // $$.buildCtx.clearRect(0, 0, $$.build.width, $$.build.height);

        // Get the times stamp and set the temporary position to the last player tile
        var time  = new Date().getTime();

        // Returns (exact) x, y, z, (map tile) xtile, ytile, and (animation) key
        var player     = APP.player.getFrameOffsets(),
            radius     = BOOTSTRAP.settings.rstep;

        // Loop through every tile in a square radius of player
        for (var x = player.gx - radius; x <= player.gx + radius; x++) {
            for (var y = player.gy - radius; y <= player.gy + radius; y++) {
                // Get the tile for this coordinate, get image path, and z too                
                
                var tile      = APP.world.getTile(x, y),
                    imagePath = '/img/terrain/' + tile.getType() + 'x' + tile.getVariant() + '.png',
                    zTile     = tile.getZ();

                // Calculate the image rendering coordinates relative to the player
                var xRel = x - player.x,
                    yRel = y - player.y,
                    zRel = zTile - player.z;

                $$.renderImage(imagePath, xRel, yRel, zRel);

                // If we are at the center of the screen, render the player
                if (Math.floor(xRel) == 0 && Math.floor(yRel) == 0) {
                    $$.renderPlayer();
                }

                // Overlay a tile of water if tile is flooded
                if (!$$.settings.drought && tile.isFlooded()) {
                    // Every half a second the animation for water changes
                    var waterVariant = (Math.round(time % 500 / 500) + 1);
                    
                    imagePath = '/img/terrain/' + APP.TILE_TYPE_WATER + 'x' + waterVariant + '.png';
                    zRel      = tile.getZFlood() - player.z;

                    $$.renderImage(imagePath, xRel, yRel, zRel);
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

    $$.renderImage = function(imagePath, xRel, yRel, zRel) {
        // xc and yc represent the center of the render canvas, ztep locks tiles by height increments of 8
        // x and y offset represent the difference from top left to visual center of image object
        // Below is a standard translation from 3d isometric to 2d canvas
        var image = APP.spriteAlbum.get(imagePath);

        if (image) {
            var xCanvas = $$.xc + (xRel * image.xOffset) - (yRel * image.xOffset) - image.xOffset,
                yCanvas = $$.yc + (xRel * image.yOffset) + (yRel * image.yOffset) - image.yOffset - (zRel * BOOTSTRAP.settings.zstep);

            $$.buildCtx.drawImage(image.canvas, xCanvas, yCanvas);
        } else {
            console.log(imagePath + ' does not exist');
        }

    }
    
    $$.renderTile = function(tile, x, y, z)
    {
        // Translate 3D coordinates to 2D Isometric
        var xpos = $$.xc + x * tile.xoff - y * tile.xoff - tile.xoff;
        var ypos = $$.yc + x * tile.yoff + y * tile.yoff - tile.yoff - z * $$.settings.zstep;

        $$.buildCtx.drawImage(tile.cvs, xpos, ypos);
    }

    $$.renderPlayer = function(isGhost)
    {
        if (isGhost) {
            $$.buildCtx.globalAlpha = 0.5;
        }

        var playerSprite = APP.spriteAlbum.get(APP.PLAYER_PATH),
            step         = 0;

        switch (APP.player.state) {
            case APP.player.STATE_WALKING:
                step = APP.player.frameCount % APP.player.frameLoop;
                break;
            case APP.player.STATE_JUMPING:
                step = 3;
                break;
            case APP.player.STATE_STANDING:
            default:
                step = 0;
                break;
        }
        
        // Frame determines where in sprite to grab based on rotation and action
        var frame = 4 * APP.player.globalDir + step,
            sx = playerSprite.width * frame,
            sy = 0,
            sw = playerSprite.width,
            sh = playerSprite.height,
            dx = $$.xc - playerSprite.xOffset,
            dy = $$.yc - playerSprite.yOffset;

        $$.buildCtx.drawImage(playerSprite.canvas, sx, sy, sw, sh, dx, dy, sw, sh);
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