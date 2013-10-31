define(function() 
{
    
    var Sprite = $C.extend({
        width:    null,
        height:   null,
        xOffset:  null,
        yOffset:  null,
        
        canvas:   null,
        context:  null,
        promise:  null,
        
        init: function(path, width, height, xOffset, yOffset, promise) 
        {
            this.promise = $.Deferred();
            
            this.width   = width;
            this.height  = height;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
    

            this.canvas  = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            
            var sprite = this,
                image  = new Image();
                
            // Try to load image and add a deferred promise
            image.onload = function() {
                sprite.canvas.setAttribute('width', image.naturalWidth);
                sprite.canvas.setAttribute('height', image.naturalHeight);

                sprite.context.drawImage(this, 0, 0, image.naturalWidth, image.naturalHeight);
    
                // Create a promise on this object for deferred loading
                console.log('image loaded');
                sprite.promise.resolve();
            }
            
            image.src = path;
        },
        
        getPromise: function() {
            return this.promise;
        }
    });
    
    return Sprite;
    
});