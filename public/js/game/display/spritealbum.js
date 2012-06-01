define(['./sprite'], function(Sprite) 
{
    
    var SpriteAlbum = $C.extend({
        album: null,
        
        init: function() 
        {
            this.album = {};
        },
        
        get: function(path) 
        {
            return this.album[path] || false;
        },
        
        set: function(path, width, height, xOffset, yOffset, promise) 
        {
            console.log('creating sprite ' + path);
            
            this.album[path] = new Sprite(path, width, height, xOffset, yOffset, promise);
            
            return this.album[path];
        },
        
        getPromises: function() 
        {
            var promises = [];
            for (var i in this.album) {
                promises.push(this.album[i].promise);
            }
            
            return promises;
        }
    });
    
    return SpriteAlbum;
    
});