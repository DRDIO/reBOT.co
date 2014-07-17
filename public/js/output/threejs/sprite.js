define(function() 
{
    /**
     * @var Sprite
     */
    return $C.extend({
        width:    null,
        height:   null,
        xOffset:  null,
        yOffset:  null,
        
        cube:     null,
        promise:  null,
        geometry: null,
        material: null,
        
        init: function(path, width, height, xOffset, yOffset, options)
        {
            this.promise = $.Deferred();
            
            this.width   = width;
            this.height  = height;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
            this.options = options;

            this.geometry = new THREE.BoxGeometry(width, width, height);

            var hOffset = -height / 2;
            if (options.isPlayer) {
                hOffset = height / 2;
            }
            this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, hOffset) );

            this.material = new THREE.MeshLambertMaterial( { color: options.color || 0xffffff } );

            this.promise.resolve();
        },
        
        getPromise: function() {
            return this.promise;
        }
    });
});