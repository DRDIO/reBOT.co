define([
    './tile', 
    '../tool/simplexnoise',
    '../entity/entity',
    '../entity/player'
], function(Tile, SimplexNoise, Entity, Player) {
    
    var World = $C.extend({
        config:         null, 
        map:            null,
        zNormalized:    null,
        lowFrequency:   null,
        lowAmplitude:   null,
        highFrequency:  null,
        highAmplitude:  null,
        rstep:          null,
        zstep:          null,
        simplex:        null,
        io:             null,
        player:         null,
        drought:        null,
        
        init: function(config, io, randomSeed) 
        {
            console.log(config.rstep);

            $L.html('Generating Player World');

            this.config         = config;

            this.map            = {};
            this.zNormalized    = (config.namp1.v + config.namp2.v) / 100;
            this.lowFrequency   = config.nstep1.v;
            this.lowAmplitude   = config.namp1.v;
            this.highFrequency  = config.nstep2.v;
            this.highAmplitude  = config.namp2.v;
            this.rstep          = config.rstep.v;
            this.zstep          = config.zstep.v;
            this.drought        = config.drought.v;
            
            // Our connection to the server
            this.io         = io;            
            this.simplex    = new SimplexNoise(undefined, randomSeed);             
            this.player     = new Player();
            
            // Seed the world for the player
            this.seed(config.gx, config.gy, config.rstep.v);

            console.log(this.map);
        },
        
        seed: function(xCenter, yCenter, radius) 
        {
            console.log([xCenter, yCenter, radius]);

            for (var x = xCenter - radius; x <= xCenter + radius; x++) {
                if (!this.map[x]) {
                    this.map[x] = {};
                }
    
                for (var y = yCenter - radius; y <= yCenter + radius; y++) {
                    if (!this.map[x][y]) {
                        this.map[x][y] = this.createTile(x, y);
                    }
                }
            }
        },
        
        getTile: function(x, y) 
        {
            if (!(x in this.map) || !(y in this.map[x])) {
                this.seed(x, y, this.rstep);
            }

            return this.map[x][y];
        },
        
        getZ: function(x, y)
        {
            return this.getTile(x, y).getZ();    
        },
        
        createTile: function(x, y) 
        {
            var z         = this.createZ(x, y),
                variant   = 1,
                zFlood    = this.createZFlood(z),
                tile      = new Tile(null, null, null, null, zFlood),
                type      = this.createType(tile, z),
                smooth    = this.smoothTerrain(tile, x, y, z, type, variant, this.rstep);

            tile.setZ(Math.round(smooth.z));
            tile.setTypeVariant(smooth.type, smooth.variant);

            return tile;
        },
        
        createZ: function(x, y) 
        {
            var zLowFreq  = this.simplex.noise(x / this.lowFrequency,  y / this.lowFrequency)  * this.lowAmplitude,
                zHighFreq = this.simplex.noise(x / this.highFrequency, y / this.highFrequency) * this.highAmplitude,
                z         = zLowFreq + zHighFreq;
            
            return z;  
        },
        
        createType: function(tile, z) 
        {
            // set the default type to grass and get min/max height of world
            var type = tile.TYPE_GRASS;
    
            // type settings are percentages of max z range of map
            if (z < this.config.lvlwater.v        * this.zNormalized) {
                type = tile.TYPE_MUD;
            } else if (z < this.config.lvlbeach.v * this.zNormalized) {
                type = tile.TYPE_SAND;
            } else if (z < this.config.lvlplain.v * this.zNormalized) {
                type = tile.TYPE_PLAIN;
            } else if (z > this.config.lvlsnow.v  * this.zNormalized) {
                type = tile.TYPE_ICE;
            } else if (z > this.config.lvlmount.v * this.zNormalized) {
                type = tile.TYPE_STONE;
            } else if (z > this.config.lvlhill.v  * this.zNormalized) {
                type = tile.TYPE_HILL;
            }
    
            return type;
        },
        
        createZFlood: function(z)
        {
            // This tile is flooded if below global water level
            if (!this.drought && z < this.config.lvlwater.v * this.zNormalized) {
                return this.config.lvlwater.v * this.zNormalized;
            }

            return false;
        },
        
        smoothTerrain: function(tile, x, y, z, type, variant, radiusMax) {
            // Quickly check if tile is within square of radius dr
            if (Math.abs(x) <= radiusMax && Math.abs(y) <= radiusMax) {
                
                // Get the distance from tile (circular)
                var radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    
                // Add a dash of seeded random magic to make a cobble patch
                if (radiusMax / 2 * Math.random() + 1 > radius) {
                    type    = tile.TYPE_ROAD;
                    variant = Math.ceil(Math.random() * 4);
                }
    
                if (radius < radiusMax) {
                    z = radius * z / radiusMax;
                }
            }
    
            return {
                z:       z,
                type:    type,
                variant: variant
            }
        }
    });
    
    return World;
    
});
