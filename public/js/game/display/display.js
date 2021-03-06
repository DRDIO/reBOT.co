define(['./spritealbum'], function(SpriteAlbum) 
{
    var Display = $C.extend({
        spriteAlbum: null,
        paths:       null,
        container:   null,
        canvas:      null,
        w:           null,
        h:           null,
        xc:          null,
        yc:          null,
        build:       null,
        buildCtx:    null,
        
        init: function(container, label, paths) 
        {
            $L.html('Building Canvas');
            
            this.spriteAlbum = new SpriteAlbum();
            this.container   = container;
            this.paths       = paths;
            
            this.container.append($('<canvas/>', {
                id:     label,
                width:  'inherit',
                height: 'inherit'
            }));
            
            console.log(this.container);
            
            this.canvas = this.container.children('#' + label);
            
            this.w = this.canvas.width();
            this.h = this.canvas.height();
            
            this.xc = this.width  / 2;
            this.yc = this.height / 2;
            
            // Declare all sprite sets and add them accordingly
            var tiles = [
                '1x1',
                '2x1',
                '3x1',
                '4x1',
                '5x1',
                '6x1',
                '7x1',
                '8x1',
                '8x2',
                '9x1',
                '9x2',
                '9x3',
                '9x4'
            ];
            
            for (var i in tiles) {
                $L.html('Loading ' + tiles[i]);
                
                var path = '/img/terrain/' + tiles[i] + '.png';
                this.spriteAlbum.set(path, 64, 31, 32, 16);
            }  
            
            // Create Custom Player
            var playerSprite = this.spriteAlbum.set(paths.player);
    
            this.tintCanvas(playerSprite.context, playerSprite.canvas.width, playerSprite.canvas.height,
                Math.round(Math.random() * 128),
                Math.round(Math.random() * 128),
                Math.round(Math.random() * 128));
        },
        
        getPromises: function()
        {
            return this.spriteAlbum.getPromises();
        },
        
        tintCanvas: function(ctx, w, h, r, g, b)
        {
            var imgData = ctx.getImageData(0, 0, w, h);
            for (var i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i]     += r;
                imgData.data[i + 1] += g;
                imgData.data[i + 2] += b;
            }

            ctx.putImageData(imgData, 0, 0);
        },
        
        render: function(world, player, rstep)
        {
            // $('#game').clearRect(0, 0, $$.build.width, $$.build.height);
            // $$.buildCtx.clearRect(0, 0, $$.build.width, $$.build.height);
    
            // Get the times stamp and set the temporary position to the last player tile
            var time  = new Date().getTime();
    
            // Returns (exact) x, y, z, (map tile) xtile, ytile, and (animation) key
            var playerOS   = player.getFrameOffset(),
                radius     = rstep;
    
            console.log('rendering a frame');
            
            // Loop through every tile in a square radius of player
            for (var x = playerOS.gx - radius; x <= playerOS.gx + radius; x++) {
                for (var y = playerOS.gy - radius; y <= playerOS.gy + radius; y++) {
                    // Get the tile for this coordinate, get image path, and z too                
                    
                    var tile      = world.getTile(x, y),
                        imagePath = '/img/terrain/' + tile.getType() + 'x' + tile.getVariant() + '.png',
                        zTile     = tile.getZ();
    
                    // Calculate the image rendering coordinates relative to the player
                    var xRel = x - playerOS.x,
                        yRel = y - playerOS.y,
                        zRel = zTile - playerOS.z;
    
                    $$.renderImage(imagePath, xRel, yRel, zRel);
    
                    // If we are at the center of the screen, render the player
                    if (Math.floor(xRel) === 0 && Math.floor(yRel) === 0) {
                        $$.renderPlayer(this.paths.player, playerOS);
                    }
    
                    // Overlay a tile of water if tile is flooded
                    if (!$$.settings.drought && tile.isFlooded()) {
                        // Every half a second the animation for water changes
                        var waterVariant = (Math.round(time % 500 / 500) + 1);
                        
                        imagePath = '/img/terrain/' + tile.TYPE_WATER + 'x' + waterVariant + '.png';
                        zRel      = tile.getZFlood() - playerOS.z;
    
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
        },
        
        renderImage: function(imagePath, xRel, yRel, zRel) 
        {
            // xc and yc represent the center of the render canvas, ztep locks tiles by height increments of 8
            // x and y offset represent the difference from top left to visual center of image object
            // Below is a standard translation from 3d isometric to 2d canvas
            var image = this.spriteAlbum.get(imagePath);
    
            if (image) {
                var xCanvas = $$.xc + (xRel * image.xOffset) - (yRel * image.xOffset) - image.xOffset,
                    yCanvas = $$.yc + (xRel * image.yOffset) + (yRel * image.yOffset) - image.yOffset - (zRel * BOOTSTRAP.settings.zstep);
    
                this.buildCtx.drawImage(image.canvas, xCanvas, yCanvas);
            } else {
                console.log(imagePath + ' does not exist');
            }    
        },
    
        renderPlayer: function(imagePath, playerOS, isGhost)
        {
            if (isGhost) {
                this.buildCtx.globalAlpha = 0.5;
            }
    
            var playerSprite = this.spriteAlbum.get(imagePath),
                step         = 0;
    
            switch (playerOS.state) {
                case APP.player.STATE_WALKING:
                    step = playerOS.frameCount % playerOS.frameLoop;
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
    });
    
    return Display;
});
 
 /*
var BOOTSTRAP = (function($$) 
{
    


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

*/