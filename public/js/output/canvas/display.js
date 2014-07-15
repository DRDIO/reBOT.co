define([
    './spritealbum'
], function(SpriteAlbum) {
    var Display = $C.extend({
        spriteAlbum: null,
        paths:       null,
        container:   null,
        build:       null,
        bldctx:      null,
        canvas:      null,
        context:     null,
        w:           null,
        h:           null,
        xc:          null,
        yc:          null,
        
        init: function(container, label, paths) 
        {
            $L.html('Building Canvas');
            
            this.spriteAlbum = new SpriteAlbum();
            this.container   = container;
            this.paths       = paths;
            
            this.container.append($('<canvas/>', {
                id:     label
            }));
            
            this.canvas = this.container.children('#' + label)[0];


            this.canvas.width = 640;
            this.canvas.height = 400;

            this.w = this.canvas.width;
            this.h = this.canvas.height;

            this.canvas.style.width = 640 + 'px';
            this.canvas.style.height = 400 + 'px';

            this.context = this.canvas.getContext('2d');

            
            this.xc = this.w / 2;
            this.yc = this.h / 2;
            
            // Declare all sprite sets and add them accordingly
            var tiles = [
                '1x1',
                '2x1',
                '3x1',
                '4x1',
                '5x1',
                '6x1',
                '7x1',
                '9x1',
                '9x2',
                '9x3',
                '9x4'
            ];

            var water = [
                '8x1',
                '8x2'
            ];
            
            for (var i in tiles) {
                $L.html('Loading ' + tiles[i]);
                
                var path = '/img/terrain/' + tiles[i] + '.png';
                this.spriteAlbum.set(path, 64, 206, 32, 16);
            }

            for (var i in water) {
                $L.html('Loading ' + water[i]);
                
                var path = '/img/terrain/' + water[i] + '.png';
                this.spriteAlbum.set(path, 64, 31, 32, 16);
            }
            
            // Create Custom Player
            $L.html('Loading Player');
            var playerSprite = this.spriteAlbum.set(paths.player, 32, 48, 16, 40);
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

        /**
         * Render a complete frame
         *
         * @param world
         * @param player
         * @param rstep
         */
        render: function(world, player, rstep)
        {
            // Every half a second the animation for water changes
            var time  = new Date().getTime();
            var cycle = (Math.round(time % 333 / 333) + 1);
    
            // Returns (exact) x, y, z, (map tile) xtile, ytile, and (animation) key
            var playerOS   = player.getFrameOffset(), x, y;

            for (x = playerOS.gx - rstep; x <= playerOS.gx + rstep; x++) {
                for (y = playerOS.gy - rstep; y <= playerOS.gy + rstep; y++) {
                    this.renderTile(world, playerOS, cycle, x, y);
                }
            }
        },

        /**
         * Render a single world tile
         *
         * @param world
         * @param playerOS
         * @param cycle
         * @param x
         * @param y
         */
        renderTile: function(world, playerOS, cycle, x, y)
        {
            // Get the tile for this coordinate, get image path, and z too

            var tile      = world.getTile(x, y);
            var imagePath = '/img/terrain/' + tile.getType() + 'x' + tile.getVariant() + '.png';
            var zTile     = tile.getZ();

            // Calculate the image rendering coordinates relative to the player
            var xRel = x - playerOS.x;
            var yRel = y - playerOS.y;
            var zRel = zTile - playerOS.z;

            this.renderImage(imagePath, xRel, yRel, zRel, world.zstep);

            // Render the player if we are around the center tile (note the rounding due to player sub steps)
            if (Math.round(xRel) == 0 && Math.round(yRel) == 0) {
                this.renderPlayer(this.paths.player, playerOS);
            }

            // Overlay a tile of water if tile is flooded
            if (!world.drought && tile.isFlooded()) {

                imagePath = '/img/terrain/' + tile.TYPE_WATER + 'x' + cycle + '.png';
                zRel      = tile.getZFlood() - playerOS.z;

                this.renderImage(imagePath, xRel, yRel, zRel, world.zstep);
            }
        },

        /**
         * Calculate offsets to draw a tile relative to world offsets
         *
         * @param imagePath
         * @param xRel
         * @param yRel
         * @param zRel
         * @param zStep
         */
        renderImage: function(imagePath, xRel, yRel, zRel, zStep) 
        {
            // xc and yc represent the center of the render canvas, zStep locks tiles by height increments of 8
            // x and y offset represent the difference from top left to visual center of image object
            // Below is a standard translation from 3d isometric to 2d canvas
            var image = this.spriteAlbum.get(imagePath);

            var xCanvas = this.xc + (xRel * image.xOffset) - (yRel * image.xOffset) - image.xOffset,
                yCanvas = this.yc + (xRel * image.yOffset) + (yRel * image.yOffset) - image.yOffset - (zRel * zStep);

            this.context.drawImage(image.canvas, xCanvas, yCanvas);
        },

        /**
         * Render the main player
         * @param imagePath
         * @param playerOS
         */
        renderPlayer: function(imagePath, playerOS)
        {
            var playerSprite = this.spriteAlbum.get(imagePath),
                step         = 0;

            switch (playerOS.state) {
                case playerOS.entity.STATE_WALKING:
                    step = playerOS.entity.frameCount % playerOS.entity.frameLoop;
                    break;
                case playerOS.entity.STATE_JUMPING:
                    step = 3;
                    break;
                case playerOS.entity.STATE_STANDING:
                default:
                    step = 0;
                    break;
            }
            
            // Frame determines where in sprite to grab based on rotation and action
            var frame = 4 * playerOS.entity.globalDir + step,
                sx = playerSprite.width * frame,
                sy = 0,
                sw = playerSprite.width,
                sh = playerSprite.height,
                dx = this.xc - playerSprite.xOffset,
                dy = this.yc - playerSprite.yOffset;
    
            this.context.drawImage(playerSprite.canvas, sx, sy, sw, sh, dx, dy, sw, sh);
        }
    });
    
    return Display;
});
