define(['tool/settings', 'tool/simplexnoise'], function() {
    var World = function() {
        this.init();
    }

    World.prototype.init = function() {
        this.map            = {};
        this.zNormalized    = (BOOTSTRAP.settings.namp1 + BOOTSTRAP.settings.namp2) / 100;
        this.lowFrequency   = BOOTSTRAP.settings.nstep1;
        this.lowAmplitude   = BOOTSTRAP.settings.namp1;
        this.highFrequency  = BOOTSTRAP.settings.nstep2;
        this.highAmplitude  = BOOTSTRAP.settings.namp2;
    }

    World.prototype.seed = function(xCenter, yCenter, radius) {

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
    };

    World.prototype.getTile = function(x, y) {
        if (!(x in this.map) || !(y in this.map[x])) {
            this.seed(x, y, BOOTSTRAP.settings.rstep);
        }

        return this.map[x][y];
    }

    World.prototype.createTile = function(x, y) {
        var z         = this.createZ(x, y),
            type      = this.createType(z),
            variant   = 1,
            zFlood    = this.createZFlood(z),
            smooth    = this.smoothTerrain(x, y, z, type, variant, BOOTSTRAP.settings.rstep),
            tile      = new APP.Tile(Math.round(smooth.z), smooth.type, smooth.variant, zFlood);
            
        return tile;
    };
    
    World.prototype.createZ = function(x, y) {
        var zLowFreq  = APP.simplex.noise(x / this.lowFrequency,  y / this.lowFrequency)  * this.lowAmplitude,
            zHighFreq = APP.simplex.noise(x / this.highFrequency, y / this.highFrequency) * this.highAmplitude,
            z         = zLowFreq + zHighFreq;
            
        return z;
    }
      
    World.prototype.createType = function(z) {
        // set the default type to grass and get min/max height of world
        var type = APP.TILE_TYPE_GRASS;

        // type settings are percentages of max z range of map
        if (z < BOOTSTRAP.settings.lvlwater        * this.zNormalized) {
            type = APP.TILE_TYPE_MUD;
        } else if (z < BOOTSTRAP.settings.lvlbeach * this.zNormalized) {
            type = APP.TILE_TYPE_SAND;
        } else if (z < BOOTSTRAP.settings.lvlplain * this.zNormalized) {
            type = APP.TILE_TYPE_PLAIN;
        } else if (z > BOOTSTRAP.settings.lvlsnow  * this.zNormalized) {
            type = APP.TILE_TYPE_ICE;
        } else if (z > BOOTSTRAP.settings.lvlmount * this.zNormalized) {
            type = APP.TILE_TYPE_STONE;
        } else if (z > BOOTSTRAP.settings.lvlhill  * this.zNormalized) {
            type = APP.TILE_TYPE_HILL;
        }

        return type;
    }

    World.prototype.createZFlood = function(z) {
        // This tile is flooded if below global water level
        if (!BOOTSTRAP.settings.drought && z < BOOTSTRAP.settings.lvlwater * this.zNormalized) {
            return BOOTSTRAP.settings.lvlwater * this.zNormalized;
        }

        return false;
    }

    World.prototype.smoothTerrain = function(x, y, z, type, variant, radiusMax) {
        // Quickly check if tile is within square of radius dr
        if (Math.abs(x) <= radiusMax && Math.abs(y) <= radiusMax) {
            // Get the distance from tile (circular)
            var radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

            // Add a dash of seeded random magic to make a cobble patch
            if (radiusMax / 2 * Math.random() + 1 > radius) {
                type    = APP.TILE_TYPE_ROAD;
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

    APP.world = new World();
});