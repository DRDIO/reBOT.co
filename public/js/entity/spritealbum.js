define(['./sprite'], function() {
    var SpriteAlbum = function() {
        this.album = {};
    }

    SpriteAlbum.prototype.get = function(path) {
        if (!(path in this.album)) {
            // TODO: Lazy load images as needed
            return false;
        }

        return this.album[path];
    }

    /**
     * Create a sprite and add it to the album
     */     
    SpriteAlbum.prototype.set = function(path, width, height, xOffset, yOffset, promise) {
        this.album[path] = new APP.Sprite(path, width, height, xOffset, yOffset, promise);
    }

    SpriteAlbum.prototype.getPromises = function() {
        var promises = [];
        for (var i in this.album) {
            promises.push(this.album[i].promise);
        }

        return promises;
    }

    APP.spriteAlbum = new SpriteAlbum();
});