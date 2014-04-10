define(function () {
    /**
     * @class Tile
     */
    return $C.extend({

        TYPE_GRASS: 1,
        TYPE_MUD: 2,
        TYPE_SAND: 3,
        TYPE_PLAIN: 4,
        TYPE_ICE: 5,
        TYPE_STONE: 6,
        TYPE_HILL: 7,
        TYPE_WATER: 8,
        TYPE_ROAD: 9,

        type: null,
        variant: null,
        entity: null,
        z: null,
        zFlood: null,

        init: function (z, type, variant, entity, zFlood) {
            this.setZ(z);
            this.setTypeVariant(type, variant);
            this.setEntity(entity);
            this.setZFlood(zFlood);
        },

        isOccupied: function () {
            return this.entity != false;
        },

        getType: function () {
            return this.type;
        },

        getVariant: function () {
            return this.variant;
        },

        getEntity: function () {
            return this.entity;
        },

        setEntity: function (entity) {
            this.entity = entity;
        },

        getZ: function () {
            return this.z;
        },

        setZ: function (z) {
            this.z = z;
        },

        isFlooded: function () {
            return this.zFlood != false;
        },

        getZFlood: function () {
            return this.zFlood;
        },

        setZFlood: function (zFlood) {
            this.zFlood = zFlood;
        },

        setTypeVariant: function (type, variant) {
            // Type is grass, sand, etc while variant is slope and style
            // A combination of type and variant will pull the needed Icon()
            // Width, height, and center offset are all from Icon()

            this.type = type;
            this.variant = variant;
        }
    });
});
