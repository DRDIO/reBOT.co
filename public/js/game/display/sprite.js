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
                // Transfer the image to the canvas (for later manipulations)
                sprite.context.drawImage(this, 0, 0, width, height);
    
                // Create a promise on this object for deferred loading
                console.log('image loaded');
                sprite.promise.resolve();
            }
            
            image.src = path;
        },
        
        getPromise: function() {
            return this.promise;
        },

        /**
         * Writes an image into a canvas taking into
         * account the backing store pixel ratio and
         * the device pixel ratio.
         *
         * @author Paul Lewis
         * @param {Object} opts The params for drawing an image to the canvas
         */
        drawImage: function(opts) {

            if(!opts.canvas) {
                throw("A canvas is required");
            }
            if(!opts.image) {
                throw("Image is required");
            }

            // get the canvas and context
            var canvas = opts.canvas,
                context = canvas.getContext('2d'),
                image = opts.image,

            // now default all the dimension info
                srcx = opts.srcx || 0,
                srcy = opts.srcy || 0,
                srcw = opts.srcw || image.naturalWidth,
                srch = opts.srch || image.naturalHeight,
                desx = opts.desx || srcx,
                desy = opts.desy || srcy,
                desw = opts.desw || srcw,
                desh = opts.desh || srch,
                auto = opts.auto,

            // finally query the various pixel ratios
                devicePixelRatio = window.devicePixelRatio || 1,
                backingStoreRatio = context.webkitBackingStorePixelRatio ||
                                    context.mozBackingStorePixelRatio ||
                                    context.msBackingStorePixelRatio ||
                                    context.oBackingStorePixelRatio ||
                                    context.backingStorePixelRatio || 1,

                ratio = devicePixelRatio / backingStoreRatio;

            // ensure we have a value set for auto.
            // If auto is set to false then we
            // will simply not upscale the canvas
            // and the default behaviour will be maintained
            if (typeof auto === 'undefined') {
                auto = true;
            }

            // upscale the canvas if the two ratios don't match
            if (auto && devicePixelRatio !== backingStoreRatio) {

                var oldWidth = canvas.width;
                var oldHeight = canvas.height;

                canvas.width = oldWidth * ratio;
                canvas.height = oldHeight * ratio;

                canvas.style.width = oldWidth + 'px';
                canvas.style.height = oldHeight + 'px';

                // now scale the context to counter
                // the fact that we've manually scaled
                // our canvas element
                context.scale(ratio, ratio);

            }

            context.drawImage(pic, srcx, srcy, srcw, srch, desx, desy, desw, desh);
        }
    });
    
    return Sprite;
    
});