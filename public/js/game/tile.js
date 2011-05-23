define(function() {
    APP.TILE_TYPE_GRASS = 1;
    APP.TILE_TYPE_MUD   = 2;
    APP.TILE_TYPE_SAND  = 3;
    APP.TILE_TYPE_PLAIN = 4;
    APP.TILE_TYPE_ICE   = 5;
    APP.TILE_TYPE_STONE = 6;
    APP.TILE_TYPE_HILL  = 7;
    APP.TILE_TYPE_WATER = 8;
    APP.TILE_TYPE_ROAD  = 9;

    APP.Tile = function(z, type, variant, entity, zFlood) {
        this.setZ(z);
        this.setTypeVariant(type, variant);
        this.setEntity(entity);
        this.setZFlood(zFlood);
    }

    APP.Tile.prototype.isOccupied = function() {
        return this.entity != false;
    };

    APP.Tile.prototype.getType = function() {
        return this.type;
    }

    APP.Tile.prototype.getVariant = function() {
        return this.variant;
    }

    APP.Tile.prototype.getEntity = function() {
        return this.entity;
    }

    APP.Tile.prototype.setEntity = function(entity) {
        this.entity = entity;
    }

    APP.Tile.prototype.getZ = function() {
        return this.z;
    }

    APP.Tile.prototype.setZ = function(z) {
        this.z = z;
    }

    APP.Tile.prototype.isFlooded = function() {
        return this.isFlooded != false;
    }

    APP.Tile.prototype.getZFlood = function() {
        return this.zFlood;
    }

    APP.Tile.prototype.setZFlood = function(zFlood) {
        this.zFlood = zFlood;
    }

    APP.Tile.prototype.setTypeVariant = function(type, variant) {
        // Type is grass, sand, etc while variant is slope and style
        // A combination of type and variant will pull the needed Icon()
        // Width, height, and center offset are all from Icon()
        
        this.type    = type;
        this.variant = variant;
    }
});