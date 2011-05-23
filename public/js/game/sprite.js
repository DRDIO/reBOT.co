define(function() {
    APP.Sprite = function(path, width, height, xOffset, yOffset, promise) {
        this.path    = path;
        this.promise = promise;

        this.width   = width;
        this.height  = height;
        this.xOffset = xOffset;
        this.yOffset = yOffset;

        this.canvas       = document.createElement('canvas');
        this.context      = this.canvas.getContext('2d');
        this.image        = new Image();
        this.image.src    = path;

        // Try to load image and add a deferred promise
        var sprite = this;
        this.image.onload = function() {
            sprite.canvas.width  = this.width;
            sprite.canvas.height = this.height;

            // Transfer the image to the canvas (for later manipulations)
            sprite.context.drawImage(this, 0, 0);

            // Create a promise on this object for deferred loading
            sprite.promise.resolve();
        }
    }
});