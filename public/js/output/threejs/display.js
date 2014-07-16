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

        worldgen:    {},

        init: function(paths)
        {
            $L.html('Building Canvas');

            this.spriteAlbum = new SpriteAlbum();
            this.paths       = paths;


            this.scene    = new THREE.Scene();
            this.camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

            this.camera.position.set(16, 16, 32); // The camera starts at the origin, so move it to a good position.
            this.camera.up = new THREE.Vector3( 0, 0, 1 );
            this.camera.lookAt(this.scene.position);


            // add subtle ambient lighting
            //var ambientLight = new THREE.AmbientLight(0x440044);
            //this.scene.add(ambientLight);

            // directional lighting
            var directionalLight = new THREE.DirectionalLight(0xcccccc);
            directionalLight.position.set(0, 0, 8).normalize();
            this.scene.add(directionalLight);


            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize( window.innerWidth, window.innerHeight );

            document.body.appendChild( this.renderer.domElement );

            this.w = this.renderer.width;
            this.h = this.renderer.height;

            this.xc = this.w / 2;
            this.yc = this.h / 2;

            // Declare all sprite sets and add them accordingly
            var tiles = [
                ['1x1', { color: 0x88AD69 } ],
                ['2x1', { color: 0x5F5931 } ],
                ['3x1', { color: 0xF0E3D2 } ],
                ['4x1', { color: 0x89B940 } ],
                ['5x1', { color: 0xE1F1F4 } ],
                ['6x1', { color: 0x9A9A9A } ],
                ['7x1', { color: 0x75A959 } ],
                ['9x1', { color: 0xffffff } ],
                ['9x2', { color: 0xffffff } ],
                ['9x3', { color: 0xffffff } ],
                ['9x4', { color: 0xffffff } ]
            ];

            var water = [
                ['8x1', { color: 0x00ff00 } ]
                //'8x2'
            ];

            for (var i in tiles) {
                $L.html('Loading ' + tiles[i][0]);

                var path = '/img/terrain/' + tiles[i][0] + '.png';
                this.spriteAlbum.set(path, 1, 10, 32, 16, tiles[i][1]);
            }

            for (var i in water) {
                $L.html('Loading ' + water[i][0]);

                var path = '/img/terrain/' + water[0][0] + '.png';
                this.spriteAlbum.set(path, 1, 0.5, 32, 16, tiles[i][1]);
            }

            // Create Custom Player
            $L.html('Loading Player');
            this.spriteAlbum.set(paths.player, 0.75, 0.75, 16, 40, { color: 0x0000ff });

        },

        getPromises: function()
        {
            return this.spriteAlbum.getPromises();
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

            this.renderer.render(this.scene, this.camera);
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

            this.renderImage(imagePath, x, y, zTile, world.zstep);

            // Render the player if we are around the center tile (note the rounding due to player sub steps)
            if (Math.round(x - playerOS.x) == 0 && Math.round(y - playerOS.y) == 0) {
                this.renderPlayer(this.paths.player, playerOS);
            }

            // Overlay a tile of water if tile is flooded
            if (!world.drought && tile.isFlooded()) {

                imagePath = '/img/terrain/' + tile.TYPE_WATER + 'x' + cycle + '.png';
                zRel      = tile.getZFlood() - playerOS.z;

                this.renderImage(imagePath, x, y, zTile, world.zstep);
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
        renderImage: function(imageId, x, y, z, step)
        {
            // xc and yc represent the center of the render canvas, zStep locks tiles by height increments of 8
            // x and y offset represent the difference from top left to visual center of image object
            // Below is a standard translation from 3d isometric to 2d canvas
            var image = this.spriteAlbum.get(imageId);
            var key   = x + '-' + y;

            if (typeof this.worldgen[key] === 'undefined') {
                var mesh = new THREE.Mesh(image.geometry, image.material);

                mesh.position.set(x, y, z / step);
                this.worldgen[key] = true;
                this.scene.add(mesh);
            }

            // this.context.drawImage(image.canvas, xCanvas, yCanvas);
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

            if (typeof this.worldgen['player'] === 'undefined') {
                var mesh = new THREE.Mesh(playerSprite.geometry, playerSprite.material);
                this.worldgen['player'] = mesh;
                this.scene.add(mesh);
            }

            this.worldgen['player'].position.set(0, 0, 5);
        }
    });

    return Display;
});
