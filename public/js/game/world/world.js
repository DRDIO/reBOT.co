define([
    './tile', 
    '../tool/simplexnoise',
    '../entity/entity',
    '../entity/player'
    ], function(Tile, SimplexNoise, Entity, Player) 
{
    
    var World = $C.extend({
        
        map:            null,
        zNormalized:    null,
        lowFrequency:   null,
        lowAmplitude:   null,
        highFrequency:  null,
        highAmplitude:  null,
        rstep:          null,
        tileLevel:      null,
        simplex:        null,
        io:             null,
        player:         null,
        
        init: function(config, io) 
        {
            $L.html('Generating Player World');
            
            this.map            = {};
            this.zNormalized    = (config.namp1 + config.namp2) / 100;
            this.lowFrequency   = config.nstep1;
            this.lowAmplitude   = config.namp1;
            this.highFrequency  = config.nstep2;
            this.highAmplitude  = config.namp2;
            this.rstep          = config.rstep;
            this.tileLevel      = config.tileLevel;
            
            // Our connection to the server
            this.io         = io;            
            this.simplex    = new SimplexNoise();             
            this.player     = new Player();
            
            // Seed the world for the player
            this.seed(config.gx, config.gy, config.rstep);
        },
        
        seed: function(xCenter, yCenter, radius) 
        {
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
                type      = this.createType(z),
                variant   = 1,
                zFlood    = this.createZFlood(z),
                smooth    = this.smoothTerrain(x, y, z, type, variant, this.rstep),
                tile      = new Tile(Math.round(smooth.z), smooth.type, smooth.variant, zFlood);
                
            return tile;
        },
        
        createZ: function(x, y) 
        {
            var zLowFreq  = this.simplex.noise(x / this.lowFrequency,  y / this.lowFrequency)  * this.lowAmplitude,
                zHighFreq = this.simplex.noise(x / this.highFrequency, y / this.highFrequency) * this.highAmplitude,
                z         = zLowFreq + zHighFreq;
            
            return z;  
        },
        
        createType: function(z) 
        {
            // set the default type to grass and get min/max height of world
            var type = Tile.TYPE_GRASS;
    
            // type settings are percentages of max z range of map
            if (z < this.tileLevel.water        * this.zNormalized) {
                type = Tile.TYPE_MUD;
            } else if (z < this.tileLevel.beach * this.zNormalized) {
                type = Tile.TYPE_SAND;
            } else if (z < this.tileLevel.plain * this.zNormalized) {
                type = Tile.TYPE_PLAIN;
            } else if (z > this.tileLevel.snow  * this.zNormalized) {
                type = Tile.TYPE_ICE;
            } else if (z > this.tileLevel.mount * this.zNormalized) {
                type = Tile.TYPE_STONE;
            } else if (z > this.tileLevel.hill  * this.zNormalized) {
                type = Tile.TYPE_HILL;
            }
    
            return type;
        },
        
        createZFlood: function(z)
        {
            // This tile is flooded if below global water level
            if (!this.drought && z < this.tileLevel.water * this.zNormalized) {
                return this.tileLevel.water * this.zNormalized;
            }

            return false;
        },
        
        smoothTerrain: function(x, y, z, type, variant, radiusMax) {
            // Quickly check if tile is within square of radius dr
            if (Math.abs(x) <= radiusMax && Math.abs(y) <= radiusMax) {
                
                // Get the distance from tile (circular)
                var radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    
                // Add a dash of seeded random magic to make a cobble patch
                if (radiusMax / 2 * Math.random() + 1 > radius) {
                    type    = Tile.TYPE_ROAD;
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
